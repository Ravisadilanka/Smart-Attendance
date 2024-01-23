function enableEdit() {
  // Get form elements by their IDs
  var nameInput = document.getElementById('name');
  var emailInput = document.getElementById('email');

  // Enable editing for the inputs
  nameInput.removeAttribute('readonly');
  emailInput.removeAttribute('readonly');
}
