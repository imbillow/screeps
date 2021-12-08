var roleHarvester = require('role_harvester');
var roleUpgrader = require('role_upgrader');
var roleBuilder = require('role_builder');
require('version')

function roledCreeps(role) {
    return _.filter(Game.creeps, (creep) => creep.name.startsWith(role));
}

module.exports.loop = function () {
    if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
        Memory.SCRIPT_VERSION = SCRIPT_VERSION
        console.log(`New code uplodated with version: ${SCRIPT_VERSION}`)
    }

    var tower = Game.getObjectById('9dc2e34d6fbe0143f107283e');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    let roles = [
        ["harvester", {
            r: roledCreeps('harvester'),
            x: roleHarvester,
            need: 1,
            needCreate: 0,
            priority: 0,
        }],
        ["upgrader", {
            r: roledCreeps('upgrader'),
            x: roleUpgrader,
            need: 10,
            needCreate: 0,
            priority: 2,
        }],
        ["builder", {
            r: roledCreeps('builder'),
            x: roleBuilder,
            need: 1,
            needCreate: 0,
            priority: 1,
        }],
    ]

    roles = roles.map((role) => {
        const { need, r } = role[1];
        const needCreate = need - r.length;
        return _.set(role, [1, 'needCreate'], needCreate);
    })
    roles.sort((a, b) => a[1].priority - b[1].priority)

    roles.forEach((role) => {
        const { needCreate, r, x } = role[1];
        const len = r.length;
        for (let i = 0; i < needCreate; i++) {
            const name = `${role[0]}-${len + i}`
            const r = Game.spawns['Spawn1'].spawnCreep(x.body, name, { memory: x.memory });
            switch (r) {
                case OK:
                    console.log(`${name} created`);
                    r.push(Game.creeps[name]);
                    break;
                case ERR_NAME_EXISTS:
                    console.log(`${name} exists`);
                    break;
            }
        }
        r.forEach((creep) => {
            console.log(JSON.stringify(creep))
            x.run(creep);
        })
    })
}
