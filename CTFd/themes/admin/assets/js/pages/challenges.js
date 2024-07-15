import "./main";
import CTFd from "../compat/CTFd";
import { default as helpers } from "../compat/helpers";
import $ from "jquery";
import "../compat/json";
import { ezAlert, ezQuery } from "../compat/ezq";


document.addEventListener('DOMContentLoaded', function(event) {
  document.getElementById('btn-file-input').addEventListener('click', function(event) {
      document.getElementById('thumbsnail-get-path').click();
      //document.getElementById('thumbsnail-get-path').value = document.getElementById('thumbsnail-input')
  });

  document.getElementById('thumbsnail-get-path').addEventListener('change', function(event) {
    const file = event.target.files[0];
    console.log("File selected:", file);
    let form = document.getElementById('thumbsnail-upload-form');
    // Upload the image to /files endpoint
    const extra_data = { is_challenge_thumbnail: true };
    alert(form)

    const formData = new FormData(form);
    formData.append('file', file);
    formData.append("nonce", CTFd.config.csrfNonce);
    fetch(CTFd.config.urlRoot + '/api/v1/files?admin=true&is_challenge_thumbnail=true', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(f => {
        if (f.success) {
            const imgPath = f.location;
            document.getElementById('thumbsnail-path').value = imgPath; // Assuming your server responds with the path
            console.log('Thumbnail uploaded successfully:', imgPath);

            // Update the image preview
            const img = document.getElementById('image-preview');
            img.src = imgPath; // Use the path received from the server
            img.style.display = 'block';
        } else {
            alert('Error uploading image: ' + f.errors);
        }
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.getElementById('image-preview');
            img.src = event.target.result; // Show the selected image while it's being uploaded
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
  });
    // helpers.files.upload(form, extra_data, function (response) {
    //   const f = response.data[0];
    //   if (f.success) {
    //     document.getElementById('thumbsnail-path').value = f.location;
    //     console.log('Thumbnail uploaded successfully:', f);
    //   } else {
    //     alert('Error uploading image: ' + f.errors);
    //   }
    // });
    

        // if (file) {
        //     const reader = new FileReader();
        //     reader.onload = function(event) {
        //         const img = document.getElementById('image-preview');
        //         img.src = event.target;
        //         img.style.display = 'block';
        //     };
        //     reader.readAsDataURL(file);

    // };



  // Add existing categories dynamically to the dropdown
  const categories = Object.keys(document.categories);
  const categoriesSelector = document.getElementById('categories-selector');
  categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoriesSelector.appendChild(option);
  });
  const option = document.createElement('option');
  option.value = "other";
  option.textContent = "Other (type below)";
  categoriesSelector.appendChild(option);

  // Show/hide the category input based on selection
  const categoryInput = document.getElementById('categories-selector-input');
  if (categoriesSelector.value == 'other' || categories.length == 0) {
      categoryInput.style.display = 'block';
      categoryInput.name = "category";
  } else {
      categoryInput.style.display = 'none';
      categoryInput.value = ''; // Clear input if not used
      categoryInput.name = '';
  }
  categoriesSelector.addEventListener('change', function() {
      if (categoriesSelector.value == 'other' || categories.length == 0) {
          categoryInput.style.display = 'block';
          categoryInput.name = "category";
      } else {
          categoryInput.style.display = 'none';
          categoryInput.value = ''; // Clear input if not used
          categoryInput.name = '';
      }
  });

  // Find the highest current ID in the table
  let maxId = 0;
  document.querySelectorAll('td.id').forEach(function(td) {
      const id = parseInt(td.textContent);
      if (!isNaN(id) && id > maxId) {
          maxId = id;
      }
  });

  // Set the new ID
  const newId = maxId + 1;
  document.getElementById('challenge_id_texte').textContent = newId;
  document.getElementById('challenge_id').value = newId;

  // Handle form submission
  document.getElementById('create-challenge-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(this); // Create a FormData object from the form

    // Use fetch API to send the form data
    fetch(this.action, {
      method: 'POST',
      body: formData
    }).then(response => response.json()).then(data => {
      // Handle the response data
      if (data.success) {
        alert('Challenge added successfully!');
        // Optionally, redirect or update the UI
      } else {
        alert('Error adding challenge: ' + data.errors);
      }
    }).catch(error => {
      console.error('Error:', error);
    });
  });
});

function deleteSelectedChallenges(_event) {
  let challengeIDs = $("input[data-challenge-id]:checked").map(function () {
    return $(this).data("challenge-id");
  });
  let target = challengeIDs.length === 1 ? "challenge" : "challenges";

  ezQuery({
    title: "Delete Challenges",
    body: `Are you sure you want to delete ${challengeIDs.length} ${target}?`,
    success: function () {
      const reqs = [];
      for (var chalID of challengeIDs) {
        reqs.push(
          CTFd.fetch(`/api/v1/challenges/${chalID}`, {
            method: "DELETE",
          }),
        );
      }
      Promise.all(reqs).then((_responses) => {
        window.location.reload();
      });
    },
  });
}

function bulkEditChallenges(_event) {
  let challengeIDs = $("input[data-challenge-id]:checked").map(function () {
    return $(this).data("challenge-id");
  });

  ezAlert({
    title: "Edit Challenges",
    body: $(`
    <form id="challenges-bulk-edit">
      <div class="form-group">
        <label>Category</label>
        <input type="text" name="category" data-initial="" value="">
      </div>
      <div class="form-group">
        <label>Value</label>
        <input type="number" name="value" data-initial="" value="">
      </div>
      <div class="form-group">
        <label>State</label>
        <select name="state" data-initial="">
          <option value="">--</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>
    </form>
    `),
    button: "Submit",
    success: function () {
      let data = $("#challenges-bulk-edit").serializeJSON(true);
      const reqs = [];
      for (var chalID of challengeIDs) {
        reqs.push(
          CTFd.fetch(`/api/v1/challenges/${chalID}`, {
            method: "PATCH",
            body: JSON.stringify(data),
          }),
        );
      }
      Promise.all(reqs).then((_responses) => {
        window.location.reload();
      });
    },
  });
}

$(() => {
  $("#challenges-delete-button").click(deleteSelectedChallenges);
  $("#challenges-edit-button").click(bulkEditChallenges);
});
