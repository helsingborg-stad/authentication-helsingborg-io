function Navet (rating, name) {
    this.name = name || null;
    this.rating = rating || null;
}

Navet.prototype.getrating = () => {
    return this.rating;
};

Navet.prototype.setrating = (rating) => {
    this.rating = rating;
};

Navet.prototype.getName = () => {
    return this.name;
};

Navet.prototype.setName = (name) => {
    this.name = name;
};

// not sure if useful
Navet.prototype.equals = (otherNavet) => {
    return otherNavet.getName() === this.getName() &&
        otherNavet.getrating() === this.getrating();
};

Navet.prototype.fill = (newFields) => {
    for (var field in newFields) {
        if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
            if (this[field] !== 'undefined') {
                this[field] = newFields[field];
            }
        }
    }
};

module.exports = Navet;
