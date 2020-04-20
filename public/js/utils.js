const confirmDelete = function (event, form) {
        event.preventDefault();
        let confirmBool = confirm('Are you sure? Delete?');
        if (confirmBool) {
            form.submit();
        }
}

const isValidId = function (id) {
    return (id != undefined && !isNaN(id));
};

module.exports.confirmDelete = confirmDelete;
module.exports.isValidId = isValidId;
