use contracts::MaintenanceTracker::{
    IMaintenanceTrackerDispatcher, 
    IMaintenanceTrackerDispatcherTrait, 
    TaskStatus,
    ExecutionStatus,
    // MaintenanceTask,
};
use contracts::components::ERC721Enumerable::{
    IERC721EnumerableDispatcher, IERC721EnumerableDispatcherTrait,
};
use contracts::components::Counter::{ICounterDispatcher, ICounterDispatcherTrait};

use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

const ETH_CONTRACT_ADDRESS: felt252 =
    0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7;

use openzeppelin_token::erc721::interface::{
    IERC721Dispatcher, IERC721DispatcherTrait, 
    // IERC721MetadataDispatcher,
    // IERC721MetadataDispatcherTrait,
};
use openzeppelin_utils::serde::SerializedAppend;
use snforge_std::{CheatSpan, ContractClassTrait, DeclareResultTrait, cheat_caller_address, declare, mock_call };
use starknet::{ContractAddress, contract_address_const};
use core::integer::{u256};

// Should deploy the contract
fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap().contract_class();
    let mut calldata = array![];
    calldata.append_serde(OWNER());
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    println!("Contract deployed on: {:?}", contract_address);

    contract_address
}

fn OWNER() -> ContractAddress {
    contract_address_const::<'OWNER'>()
}

fn NEW_OWNER() -> ContractAddress {
    contract_address_const::<'NEW_OWNER'>()
}

fn deploy_receiver() -> ContractAddress {
    let contract = declare("Receiver").unwrap().contract_class();
    let mut calldata = array![];
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    println!("Receiver deployed on: {:?}", contract_address);
    contract_address
}

fn RECIPIENT() -> ContractAddress {
    contract_address_const::<'RECIPIENT'>()
}

fn create_maintenance_task(
    maintenance_tracker_dispatcher: IMaintenanceTrackerDispatcher, 
    counter: ICounterDispatcher,
    tester_address: ContractAddress
) -> u256 {
    
    let first_task_id = maintenance_tracker_dispatcher.create_maintenance_task(
        client_name: "Ricardo Montes Chavez",
        system_name: "Concorde",
        maintenance_name: "Test Maintenance",
        system_cycles: 210,
        estimated_time: 5,
        start_time: 21250220,
        cost: 1000000000,
        repairman: tester_address,
        quality_inspector: tester_address
    );

    first_task_id
}

#[test]
// Test: Should be able to create a Maintenance Task
fn test_create_maintenance_task() {
    let maintenance_tracker_contract_address = deploy_contract("MaintenanceTracker");
    let maintenance_tracker_dispatcher = IMaintenanceTrackerDispatcher {
        contract_address: maintenance_tracker_contract_address,
    };
    let counter = ICounterDispatcher { contract_address: maintenance_tracker_contract_address };

    let tester_address = deploy_receiver();
    println!("Tester address: {:?}", tester_address);

    let starting_tasks_balance = counter.current(); // should be 0
    println!("Starting taks balance: {:?}", starting_tasks_balance);
    
    
    println!("Creating maintenance task...");
    let created_task_id = create_maintenance_task(
        maintenance_tracker_dispatcher,
        counter,
        tester_address
    );

    let expected_task_id = 1;
    assert(created_task_id == expected_task_id, 'Token ID must be 1');
    println!("Task created! Task ID: {:?}", created_task_id);
    let new_tasks_balance = counter.current();
    assert_eq!(new_tasks_balance, starting_tasks_balance + 1, "Starting Balance must be increased by 1");
    println!("New balance of tasks: {:?}", new_tasks_balance);
}

#[test]
// Test: Should be able to complete(execute) a Maintenance Task
fn test_execute_task() {
    let maintenance_tracker_contract_address = deploy_contract("MaintenanceTracker");
    let maintenance_tracker_dispatcher = IMaintenanceTrackerDispatcher {
        contract_address: maintenance_tracker_contract_address,
    };
    let counter = ICounterDispatcher { contract_address: maintenance_tracker_contract_address };

    let tester_address = deploy_receiver();
    println!("Tester address: {:?}", tester_address);

    let starting_tasks_balance = counter.current(); // should be 0
    println!("Starting taks balance: {:?}", starting_tasks_balance);
    
    
    println!("Creating maintenance task...");
    let created_task_id = create_maintenance_task(
        maintenance_tracker_dispatcher,
        counter,
        tester_address
    );

    let expected_task_id = 1;
    assert(created_task_id == expected_task_id, 'Token ID must be 1');
    println!("Task created! Task ID: {:?}", created_task_id);
    let new_tasks_balance = counter.current();
    assert_eq!(new_tasks_balance, starting_tasks_balance + 1, "Starting Balance must be increased by 1");
    println!("New balance of tasks: {:?}", new_tasks_balance);


    maintenance_tracker_dispatcher.complete_maintenance(created_task_id);
    let mt = maintenance_tracker_dispatcher.get_maintenance_task(created_task_id);
    assert!(mt.execution_status == ExecutionStatus::CompletedByRepairman, "execution_status must be CompletedByRepairman");
    println!("New execution status of task {:?}: CompletedByRepairman", created_task_id);
}

#[test]
// Test: Should be able to certify a Maintenance Task
fn test_certify_task() {
    let maintenance_tracker_contract_address = deploy_contract("MaintenanceTracker");
    let maintenance_tracker_dispatcher = IMaintenanceTrackerDispatcher {
        contract_address: maintenance_tracker_contract_address,
    };
    let counter = ICounterDispatcher { contract_address: maintenance_tracker_contract_address };

    let tester_address = deploy_receiver();
    println!("Tester address: {:?}", tester_address);

    let starting_tasks_balance = counter.current(); // should be 0
    println!("Starting taks balance: {:?}", starting_tasks_balance);
    
    
    println!("Creating maintenance task...");
    let created_task_id = create_maintenance_task(
        maintenance_tracker_dispatcher,
        counter,
        tester_address
    );

    let expected_task_id = 1;
    assert(created_task_id == expected_task_id, 'Token ID must be 1');
    println!("Task created! Task ID: {:?}", created_task_id);
    let new_tasks_balance = counter.current();
    assert_eq!(new_tasks_balance, starting_tasks_balance + 1, "Starting Balance must be increased by 1");
    println!("New balance of tasks: {:?}", new_tasks_balance);


    maintenance_tracker_dispatcher.complete_maintenance(created_task_id);
    let mt = maintenance_tracker_dispatcher.get_maintenance_task(created_task_id);
    assert!(mt.execution_status == ExecutionStatus::CompletedByRepairman, "execution_status must be CompletedByRepairman");
    println!("New execution status of task {:?}: CompletedByRepairman", created_task_id);

    maintenance_tracker_dispatcher.certify_maintenance(created_task_id);
    let mt = maintenance_tracker_dispatcher.get_maintenance_task(created_task_id);
    assert!(mt.execution_status == ExecutionStatus::CertifiedByQualityInspector, "execution_status must be CertifiedByQualityInspector");
    println!("New execution status of task {:?}: CertifiedByQualityInspector", created_task_id);
    assert!(mt.general_status == TaskStatus::CompletedUnpaid, "TaskStatus must be CompletedUnpaid");
}

#[test]
// #[fork(url: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7", block_number: 77864)]
// or...
// #[fork(url: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7", block_tag: latest)]
// or...
// #[fork("SEPOLIA_LATEST", block_number: 77864)]
// or...
#[fork("SEPOLIA_LATEST")]
// Test: Should be able to mint a Maintenance Task Certificate NFT
fn test_pay_and_mint() {
    let maintenance_tracker_contract_address = deploy_contract("MaintenanceTracker");
    let maintenance_tracker_dispatcher = IMaintenanceTrackerDispatcher {
        contract_address: maintenance_tracker_contract_address,
    };
    let counter = ICounterDispatcher { contract_address: maintenance_tracker_contract_address };
    
    let tester_address = deploy_receiver();
    println!("Tester address: {:?}", tester_address);

    let starting_tasks_balance = counter.current(); // should be 0
    println!("Starting taks balance: {:?}", starting_tasks_balance);
    
    
    println!("Creating maintenance task...");
    let created_task_id = create_maintenance_task(
        maintenance_tracker_dispatcher,
        counter,
        tester_address
    );

    let expected_task_id = 1;
    assert(created_task_id == expected_task_id, 'Token ID must be 1');
    println!("Task created! Task ID: {:?}", created_task_id);
    let new_tasks_balance = counter.current();
    assert_eq!(new_tasks_balance, starting_tasks_balance + 1, "Starting Balance must be increased by 1");
    println!("New balance of tasks: {:?}", new_tasks_balance);



    // Complete Maintenance Task
    maintenance_tracker_dispatcher.complete_maintenance(created_task_id);
    let mt = maintenance_tracker_dispatcher.get_maintenance_task(created_task_id);
    assert!(mt.execution_status == ExecutionStatus::CompletedByRepairman, "execution_status must be CompletedByRepairman");
    println!("New execution status of task {:?}: CompletedByRepairman", created_task_id);



    // Certify Maintenance Task
    maintenance_tracker_dispatcher.certify_maintenance(created_task_id);
    let mt = maintenance_tracker_dispatcher.get_maintenance_task(created_task_id);
    assert!(mt.execution_status == ExecutionStatus::CertifiedByQualityInspector, "execution_status must be CertifiedByQualityInspector");
    println!("New execution status of task {:?}: CertifiedByQualityInspector", created_task_id);
    assert!(mt.general_status == TaskStatus::CompletedUnpaid, "TaskStatus must be CompletedUnpaid");
    


    // Pay and Mint
    let tester_address = deploy_receiver();
    println!("Tester address: {:?}", tester_address);

    let nft_cost = 1_000_000_000;
    
    // Instantiating the ETH dispatcher
    let eth = IERC20Dispatcher {
        contract_address: ETH_CONTRACT_ADDRESS.try_into().unwrap()
    };
    
    let erc721 = IERC721Dispatcher { contract_address: maintenance_tracker_contract_address };

    // Mocking the transfer_from function of ETH contract to avoid having to deal with minting ETHs (which is not part of this development indeed)
    mock_call(
        contract_address_const::<ETH_CONTRACT_ADDRESS>(),
        selector!("transfer_from"),
        array![0],
        1
    );

    
    // Approving spend of ETH
    cheat_caller_address(contract_address_const::<ETH_CONTRACT_ADDRESS>(), tester_address, CheatSpan::TargetCalls(1));
    eth.approve(maintenance_tracker_contract_address, nft_cost);

    let starting_balance = erc721.balance_of(tester_address);
    println!("Starting certificates balance: {:?}", starting_balance);

    println!("Minting...");
    let url: ByteArray = "QmdtibqnMFai8CwQ6qUUUkxhs4MAZNPnrx9h4Ncn5PyQpn";
    maintenance_tracker_dispatcher.pay_and_mint(created_task_id, tester_address, url.clone());
    
    let new_balance = erc721.balance_of(tester_address);
    assert_eq!(new_balance, starting_balance + 1, "Starting Balance must be increased by 1");
    println!("Tester address new balance: {:?}", new_balance);

    // Should track tokens of owner by index
    let erc721Enumerable = IERC721EnumerableDispatcher {
        contract_address: maintenance_tracker_contract_address,
    };
    let index = new_balance - 1;
    let first_token_id = erc721Enumerable.token_of_owner_by_index(tester_address, index);
    assert_eq!(first_token_id, expected_task_id, "Token must be 1");
    println!("Token of owner({:?}) by index({:?}): {:?}", tester_address, index, first_token_id);

    let mt = maintenance_tracker_dispatcher.get_maintenance_task(created_task_id);
    assert!(mt.general_status == TaskStatus::CertificateMinted, "execution_status must be CertificateMinted");
    println!("New status of task {:?}: CertificateMinted", created_task_id);
}
