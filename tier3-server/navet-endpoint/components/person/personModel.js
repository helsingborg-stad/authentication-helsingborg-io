// Accept name and Id in the constructor
function Person (id, name, occupation) {
    this.id = id || null;
    this.name = name || null;
    this.occupation = occupation || null;
}

Person.prototype.getId = () => {
    return this.id;
};

Person.prototype.setId = (id) => {
    this.id = id;
};

Person.prototype.getName = () => {
    return this.name;
};

Person.prototype.setName = (name) => {
    this.name = name;
};

Person.prototype.getOccupation = () => {
    return this.occupation;
};

Person.prototype.setOccupation = (occupation) => {
    this.occupation = occupation;
};

// not sure if useful
Person.prototype.equals = (otherPerson) => {
    return otherPerson.getName() === this.getName() &&
        otherPerson.getId() === this.getId() &&
        otherPerson.getOccupation() === this.getOccupation();
};

Person.prototype.fill = (newFields) => {
    for (var field in newFields) {
        if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
            if (this[field] !== 'undefined') {
                this[field] = newFields[field];
            }
        }
    }
};

module.exports = Person;
