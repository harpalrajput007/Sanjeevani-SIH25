// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HerbTrace {
    struct StatusUpdate {
        string status;
        uint256 timestamp;
        address updatedBy;
    }

    struct Batch {
        uint256 id;
        string herbName;
        string quantity;
        string ipfsImageHash;
        string geoLocation;
        uint256 collectionTimestamp;
        address owner;
        StatusUpdate[] statusHistory;
    }

    mapping(uint256 => Batch) public batches;
    uint256 public nextBatchId = 1;

    event BatchCreated(uint256 indexed batchId, string herbName, address owner);
    event StatusUpdated(uint256 indexed batchId, string status, address updatedBy);
    event OwnershipTransferred(uint256 indexed batchId, address newOwner);

    function createBatch(
        string memory _herbName,
        string memory _quantity,
        string memory _ipfsImageHash,
        string memory _geoLocation
    ) public returns (uint256) {
        uint256 batchId = nextBatchId++;
        
        Batch storage newBatch = batches[batchId];
        newBatch.id = batchId;
        newBatch.herbName = _herbName;
        newBatch.quantity = _quantity;
        newBatch.ipfsImageHash = _ipfsImageHash;
        newBatch.geoLocation = _geoLocation;
        newBatch.collectionTimestamp = block.timestamp;
        newBatch.owner = msg.sender;

        // Add initial "Collected" status
        newBatch.statusHistory.push(StatusUpdate({
            status: "Collected",
            timestamp: block.timestamp,
            updatedBy: msg.sender
        }));

        emit BatchCreated(batchId, _herbName, msg.sender);
        return batchId;
    }

    function updateBatchStatus(uint256 _batchId, string memory _newStatus) public {
        require(_batchId < nextBatchId, "Batch does not exist");
        require(batches[_batchId].owner == msg.sender, "Only owner can update status");

        batches[_batchId].statusHistory.push(StatusUpdate({
            status: _newStatus,
            timestamp: block.timestamp,
            updatedBy: msg.sender
        }));

        emit StatusUpdated(_batchId, _newStatus, msg.sender);
    }

    function transferOwnership(uint256 _batchId, address _newOwner) public {
        require(_batchId < nextBatchId, "Batch does not exist");
        require(batches[_batchId].owner == msg.sender, "Only owner can transfer");
        require(_newOwner != address(0), "Invalid new owner");

        batches[_batchId].owner = _newOwner;
        emit OwnershipTransferred(_batchId, _newOwner);
    }

    function getBatchDetails(uint256 _batchId) public view returns (
        uint256 id,
        string memory herbName,
        string memory quantity,
        string memory ipfsImageHash,
        string memory geoLocation,
        uint256 collectionTimestamp,
        address owner,
        StatusUpdate[] memory statusHistory
    ) {
        require(_batchId < nextBatchId, "Batch does not exist");
        
        Batch storage batch = batches[_batchId];
        return (
            batch.id,
            batch.herbName,
            batch.quantity,
            batch.ipfsImageHash,
            batch.geoLocation,
            batch.collectionTimestamp,
            batch.owner,
            batch.statusHistory
        );
    }

    function getBatchCount() public view returns (uint256) {
        return nextBatchId - 1;
    }
}