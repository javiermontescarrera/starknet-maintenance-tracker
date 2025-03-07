use starknet::{
    ContractAddress, 
    contract_address_const, 
    get_caller_address,
    get_contract_address
};

#[derive(Drop, Serde, starknet::Store, PartialEq)]
#[allow(starknet::store_no_default_variant)]
pub enum TaskStatus {
    InProgress,
    CompletedUnpaid,
    CompletedPaid,
    CertificateMinted,
}

#[derive(Drop, Serde, starknet::Store, PartialEq)]
#[allow(starknet::store_no_default_variant)]
pub enum ExecutionStatus {
    None,
    CompletedByRepairman,
    CertifiedByQualityInspector,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct MaintenanceTask {
    pub client_name: ByteArray,
    pub system_name: ByteArray,
    pub maintenance_name: ByteArray,
    pub system_cycles: u64,
    pub estimated_time: felt252,
    pub start_time: felt252,
    pub cost: u256,
    pub general_status: TaskStatus,
    pub execution_status: ExecutionStatus,
    pub repairman: ContractAddress,
    pub quality_inspector: ContractAddress,
}

#[starknet::interface]
pub trait IMaintenanceTracker<T> {
    fn create_maintenance_task(
        ref self: T,
        client_name: ByteArray,
        system_name: ByteArray,
        maintenance_name: ByteArray,
        system_cycles: u64,
        estimated_time: felt252,
        start_time: felt252,
        cost: u256,
        repairman: ContractAddress,
        quality_inspector: ContractAddress
    ) -> u256;
    fn get_maintenance_task(self: @T, task_id: u256) -> MaintenanceTask;
    fn complete_maintenance(ref self: T, task_id: u256);
    fn certify_maintenance(ref self: T, task_id: u256);
    fn pay_and_mint(ref self: T, task_id: u256, recipient: ContractAddress, uri: ByteArray);
    // fn mint_item(ref self: T, recipient: ContractAddress, uri: ByteArray) -> u256;
}

#[starknet::contract]
mod MaintenanceTracker {
    use contracts::components::Counter::CounterComponent;
    use core::num::traits::zero::Zero;
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_introspection::src5::SRC5Component;

    use openzeppelin_token::erc721::extensions::ERC721EnumerableComponent;
    use openzeppelin_token::erc721::{
        ERC721Component, interface::{IERC721Metadata, IERC721MetadataCamelOnly},
    };
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    use super::{
        ContractAddress, 
        contract_address_const, 
        get_caller_address, 
        get_contract_address, 
        IMaintenanceTracker, 
        TaskStatus, 
        ExecutionStatus, 
        MaintenanceTask
    };

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: CounterComponent, storage: token_id_counter, event: CounterEvent);
    component!(path: ERC721EnumerableComponent, storage: enumerable, event: EnumerableEvent);

    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

    // Expose entrypoints
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    #[abi(embed_v0)]
    impl CounterImpl = CounterComponent::CounterImpl<ContractState>;
    #[abi(embed_v0)]
    impl ERC721Impl = ERC721Component::ERC721Impl<ContractState>;
    #[abi(embed_v0)]
    impl ERC721CamelOnlyImpl = ERC721Component::ERC721CamelOnlyImpl<ContractState>;
    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;
    #[abi(embed_v0)]
    impl ERC721EnumerableImpl =
        ERC721EnumerableComponent::ERC721EnumerableImpl<ContractState>;


    const ETH_CONTRACT_ADDRESS: felt252 =
    0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7;

    // Use internal implementations but do not expose them
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        token_id_counter: CounterComponent::Storage,
        #[substorage(v0)]
        enumerable: ERC721EnumerableComponent::Storage,
        // ERC721URIStorage variables
        // Mapping for token URIs
        token_uris: Map<u256, ByteArray>,

        maintenance_tasks: Map<u256, MaintenanceTask>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        CounterEvent: CounterComponent::Event,
        EnumerableEvent: ERC721EnumerableComponent::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        let name: ByteArray = "MaintenanceTracker";
        let symbol: ByteArray = "MTC";
        let base_uri: ByteArray = "https://ipfs.io/ipfs/";

        self.erc721.initializer(name, symbol, base_uri);
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl MaintenanceTrackerImpl of IMaintenanceTracker<ContractState> {

        fn create_maintenance_task(
            ref self: ContractState,
            client_name: ByteArray,
            system_name: ByteArray,
            maintenance_name: ByteArray,
            system_cycles: u64,
            estimated_time: felt252,
            start_time: felt252,
            cost: u256,
            repairman: ContractAddress,
            quality_inspector: ContractAddress
        ) -> u256
        {
            self.token_id_counter.increment();
            let task_id = self.token_id_counter.current();
            
            let new_task = MaintenanceTask {
                client_name,
                system_name,
                maintenance_name,
                system_cycles,
                estimated_time,
                start_time,
                cost,
                general_status: TaskStatus::InProgress,
                execution_status: ExecutionStatus::None,
                repairman,
                quality_inspector,
            };

            self.maintenance_tasks.write(task_id, new_task);
            task_id
        }

        fn get_maintenance_task(self: @ContractState, task_id: u256) -> MaintenanceTask {
            self.maintenance_tasks.read(task_id)
        }

        fn complete_maintenance(ref self: ContractState, task_id: u256) {
            let task = self.maintenance_tasks.read(task_id);
            match task.general_status {
                TaskStatus::InProgress => {
                    self.update_execution_status(task_id, ExecutionStatus::CompletedByRepairman);
                },
                _ => {
                    panic!("Cannot complete maintenance task: Task must be in progress");
                }
            }
        }

        fn certify_maintenance(ref self: ContractState, task_id: u256) {
            let task = self.maintenance_tasks.read(task_id);
            match task.general_status {
                TaskStatus::InProgress => {
                    self.update_execution_status(task_id, ExecutionStatus::CertifiedByQualityInspector);
                    self.update_general_status(task_id, TaskStatus::CompletedUnpaid)
                },
                _ => {
                    panic!("Cannot certify maintenance task: Task must be in progress");
                }
            }
        }

        fn pay_and_mint(ref self: ContractState, task_id: u256, recipient: ContractAddress, uri: ByteArray) {
            let task = self.maintenance_tasks.read(task_id);
            
            // Verify that execution_status current value is either "CompletedUnPaid" or "CompletedPaid"
            match task.general_status {
                TaskStatus::CompletedUnpaid => {
                    self.pay_for_task(task.cost);
                    self.update_general_status(task_id, TaskStatus::CompletedPaid);
                    self.mint_certificate(task_id, recipient, uri);
                    self.update_general_status(task_id, TaskStatus::CertificateMinted);
                },
                TaskStatus::CompletedPaid => {
                    self.mint_certificate(task_id, recipient, uri);
                    self.update_general_status(task_id, TaskStatus::CertificateMinted);
                },
                _ => {
                    panic!("NFT certificate can only be minted when execution_status is CompletedPaid");
                }
            }

        }
    }

    #[abi(embed_v0)]
    impl WrappedIERC721MetadataImpl of IERC721Metadata<ContractState> {
        // Override token_uri to use the internal ERC721URIStorage _token_uri function
        fn token_uri(self: @ContractState, token_id: u256) -> ByteArray {
            self._token_uri(token_id)
        }
        fn name(self: @ContractState) -> ByteArray {
            self.erc721.name()
        }
        fn symbol(self: @ContractState) -> ByteArray {
            self.erc721.symbol()
        }
    }

    #[abi(embed_v0)]
    impl WrappedIERC721MetadataCamelOnlyImpl of IERC721MetadataCamelOnly<ContractState> {
        // Override tokenURI to use the internal ERC721URIStorage _token_uri function
        fn tokenURI(self: @ContractState, tokenId: u256) -> ByteArray {
            self._token_uri(tokenId)
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        // token_uri custom implementation
        fn _token_uri(self: @ContractState, token_id: u256) -> ByteArray {
            assert(self.erc721.exists(token_id), ERC721Component::Errors::INVALID_TOKEN_ID);
            let base_uri = self.erc721._base_uri();
            if base_uri.len() == 0 {
                Default::default()
            } else {
                let uri = self.token_uris.read(token_id);
                format!("{}{}", base_uri, uri)
            }
        }
        // ERC721URIStorage internal functions,
        fn set_token_uri(ref self: ContractState, token_id: u256, uri: ByteArray) {
            assert(self.erc721.exists(token_id), ERC721Component::Errors::INVALID_TOKEN_ID);
            self.token_uris.write(token_id, uri);
        }


        
        fn update_general_status(ref self: ContractState, task_id: u256, new_status: TaskStatus) {
            let mut task = self.maintenance_tasks.read(task_id);
            task.general_status = new_status;
            self.maintenance_tasks.write(task_id, task);
        }

        fn update_execution_status(ref self: ContractState, task_id: u256, new_status: ExecutionStatus) {
            let mut task = self.maintenance_tasks.read(task_id);
            task.execution_status = new_status;
            self.maintenance_tasks.write(task_id, task);
        }

        fn _get_token_dispatcher(ref self: ContractState, token: ContractAddress) -> IERC20Dispatcher {
            return IERC20Dispatcher { contract_address: token };
        }

        fn pay_for_task(ref self: ContractState, cost: u256) { 
            let eth_contract_address = contract_address_const::<ETH_CONTRACT_ADDRESS>();
            // let eth_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };
            self._get_token_dispatcher(eth_contract_address)
                .transfer_from(get_caller_address(), get_contract_address(), cost);
        }

        fn mint_certificate(ref self: ContractState, task_id: u256, recipient: ContractAddress, uri: ByteArray) {
            self.erc721.mint(recipient, task_id);
            self.set_token_uri(task_id, uri);
        }
    }

    impl ERC721EnumerableHooksImpl<
        T,
        impl ERC721Enumerable: ERC721EnumerableComponent::HasComponent<T>,
        impl Counter: CounterComponent::HasComponent<T>,
        impl HasComponent: ERC721Component::HasComponent<T>,
        +SRC5Component::HasComponent<T>,
        +Drop<T>,
    > of ERC721Component::ERC721HooksTrait<T> {
        // Implement this to add custom logic to the ERC721 hooks
        // Similar to _beforeTokenTransfer in OpenZeppelin ERC721.sol
        fn before_update(
            ref self: ERC721Component::ComponentState<T>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress,
        ) {
            let counter_component = get_dep_component!(@self, Counter);
            let token_id_counter = counter_component.current();
            let mut enumerable_component = get_dep_component_mut!(ref self, ERC721Enumerable);
            if (token_id == token_id_counter) { // `Mint Token` case: Add token to `ERC721Enumerable_all_tokens` enumerable component
                let length = enumerable_component.ERC721Enumerable_all_tokens_len.read();
                enumerable_component.ERC721Enumerable_all_tokens_index.write(token_id, length);
                enumerable_component.ERC721Enumerable_all_tokens.write(length, token_id);
                enumerable_component.ERC721Enumerable_all_tokens_len.write(length + 1);
            } else if (token_id < token_id_counter
                + 1) { // `Transfer Token` Case: Remove token from owner and update enumerable component
                // To prevent a gap in from's tokens array, we store the last token in the index of
                // the token to delete, and then delete the last slot (swap and pop).
                let owner = self.owner_of(token_id);
                if owner != to {
                    let last_token_index = self.balance_of(owner) - 1;
                    let token_index = enumerable_component
                        .ERC721Enumerable_owned_tokens_index
                        .read(token_id);

                    // When the token to delete is the last token, the swap operation is unnecessary
                    if (token_index != last_token_index) {
                        let last_token_id = enumerable_component
                            .ERC721Enumerable_owned_tokens
                            .read((owner, last_token_index));
                        // Move the last token to the slot of the to-delete token
                        enumerable_component
                            .ERC721Enumerable_owned_tokens
                            .write((owner, token_index), last_token_id);
                        // Update the moved token's index
                        enumerable_component
                            .ERC721Enumerable_owned_tokens_index
                            .write(last_token_id, token_index);
                    }

                    // Clear the last slot
                    enumerable_component
                        .ERC721Enumerable_owned_tokens
                        .write((owner, last_token_index), 0);
                    enumerable_component.ERC721Enumerable_owned_tokens_index.write(token_id, 0);
                }
            }
            if (to == Zero::zero()) { // `Burn Token` case: Remove token from `ERC721Enumerable_all_tokens` enumerable component
                let last_token_index = enumerable_component.ERC721Enumerable_all_tokens_len.read()
                    - 1;
                let token_index = enumerable_component
                    .ERC721Enumerable_all_tokens_index
                    .read(token_id);

                let last_token_id = enumerable_component
                    .ERC721Enumerable_all_tokens
                    .read(last_token_index);

                enumerable_component.ERC721Enumerable_all_tokens.write(token_index, last_token_id);
                enumerable_component
                    .ERC721Enumerable_all_tokens_index
                    .write(last_token_id, token_index);

                enumerable_component.ERC721Enumerable_all_tokens_index.write(token_id, 0);
                enumerable_component.ERC721Enumerable_all_tokens.write(last_token_index, 0);
                enumerable_component.ERC721Enumerable_all_tokens_len.write(last_token_index);
            } else if (to != auth) { // `Mint Token` and `Transfer Token` case: Add token owner to `ERC721Enumerable_owned_tokens` enumerable component
                let length = self.balance_of(to);
                enumerable_component.ERC721Enumerable_owned_tokens.write((to, length), token_id);
                enumerable_component.ERC721Enumerable_owned_tokens_index.write(token_id, length);
            }
        }

        fn after_update(
            ref self: ERC721Component::ComponentState<T>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress,
        ) {}
    }
}
