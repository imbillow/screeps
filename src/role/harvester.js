var scheduleSource = require('schedule_source');

const roleHarvester = {

    body: [WORK, CARRY, MOVE],

    /** @param {Creep} creep **/
    run: function (creep) {
        const { store, room } = creep;
        if (store.getFreeCapacity() > 0) {
            scheduleSource(room, creep)
        } else {
            var targets = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
        }
    }
};

module.exports = roleHarvester;
