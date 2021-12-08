const sourceSchedule = (room, creep) => {
    let sources = room.find(FIND_SOURCES)
    if (!room.memory.schedule) {
        room.memory.schedule = {}
        for (const source of sources) {
            room.memory.schedule[source.id] = 0
        }
    }
    const source = _.minBy(sources, s => room.memory.schedule[s.id]);
    if (room.memory.schedule[source.id] > 6) {
        return false
    }
    room.memory.schedule[source.id]++;
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
            visualizePathStyle: {
                stroke: '#ffaa00'
            }
        });
    }
    return true
}

module.exports = sourceSchedule
