import "./main";
import CTFd from "../compat/CTFd";
import { default as helpers } from "../compat/helpers";
import $ from "jquery";
import "../compat/json";
import { ezAlert, ezQuery } from "../compat/ezq";

document.addEventListener("DOMContentLoaded", function (event) {
  document
    .getElementById("btn-file-input")
    .addEventListener("click", function (event) {
      document.getElementById("thumbsnail-get-path").click();
      //document.getElementById('thumbsnail-get-path').value = document.getElementById('thumbsnail-input')
    });

  document
    .getElementById("thumbsnail-get-path")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      // console.log("File selected:", file);
      let form = document.getElementById("thumbsnail-upload-form");
      // Upload the image to /files endpoint
      const extra_data = { is_challenge_thumbnail: true };

      const formData = new FormData(form);
      formData.append("file", file);
      // formData.append("nonce", CTFd.config.csrfNonce);

      helpers.files.upload(formData, form, function (response) {
        const f = response.data[0];
        const imgPath = CTFd.config.urlRoot + "/files/" + f.location;
        document.getElementById("thumbsnail-path").value = imgPath;
        console.log("Thumbnail uploaded successfully:", imgPath);

        // Update the image preview
        const img = document.getElementById("image-preview");
        img.src = imgPath; // Use the path received from the server
        img.style.display = "block";
      });

      // fetch(CTFd.config.urlRoot + '/api/v1/files?admin=true&is_challenge_thumbnail=true', {
      //     method: 'POST',
      //     body: formData
      // })
      // .then(response => response.json())  // Ensure the response is parsed as JSON
      // .then(response => {
      //     const f = response.data[0];  // Access the first item in the data array
      //     const imgPath = CTFd.config.urlRoot + "/files/" + f.location;
      //     document.getElementById('thumbsnail-path').value = imgPath;
      //     console.log('Thumbnail uploaded successfully:', imgPath);

      //     // Update the image preview
      //     const img = document.getElementById('image-preview');
      //     img.src = imgPath; // Use the path received from the server
      //     img.style.display = 'block';
      //     // if(f.location != ""){ Code gestion erreur a rajouter

      //     // }
      //     // } else {
      //     //     alert('Error uploading image: ' + f.errors);
      //     // }
      // })
      // .catch(error => {
      //     console.error('Error uploading file:', error);
      // });

      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const img = document.getElementById("image-preview");
          img.src = event.target.result; // Show the selected image while it's being uploaded
          img.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
      // });
      // helpers.files.upload(form, extra_data, function (response) {
      //   const f = response.data[0];
      //   if (f.success) {
      //     document.getElementById('thumbsnail-path').value = f.location;
      //     console.log('Thumbnail uploaded successfully:', f);
      //   } else {
      //     alert('Error uploading image: ' + f.errors);
      //   }
    });

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
  const categoriesSelector = document.getElementById("categories-selector");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoriesSelector.appendChild(option);
  });
  const option = document.createElement("option");
  option.value = "other";
  option.textContent = "Other (type below)";
  categoriesSelector.appendChild(option);

  // Show/hide the category input based on selection
  const categoryInput = document.getElementById("categories-selector-input");
  if (categoriesSelector.value == "other" || categories.length == 0) {
    categoryInput.style.display = "block";
    categoryInput.name = "category";
  } else {
    categoryInput.style.display = "none";
    categoryInput.value = ""; // Clear input if not used
    categoryInput.name = "";
  }
  categoriesSelector.addEventListener("change", function () {
    if (categoriesSelector.value == "other" || categories.length == 0) {
      categoryInput.style.display = "block";
      categoryInput.name = "category";
    } else {
      categoryInput.style.display = "none";
      categoryInput.value = ""; // Clear input if not used
      categoryInput.name = "";
    }
  });

  // Find the highest current ID in the table
  let maxId = 0;
  document.querySelectorAll("td.id").forEach(function (td) {
    const id = parseInt(td.textContent);
    if (!isNaN(id) && id > maxId) {
      maxId = id;
    }
  });

  // Set the new ID
  const newId = maxId + 1;
  document.getElementById("challenge_id_texte").textContent = newId;
  document.getElementById("challenge_id").value = newId;

  function loadAndhandleChallenge(event) {
    const params = $("#challenge-create-options-quick").serializeJSON();
    delete params.challenge_id;
    delete params.flag_type;
    if (params.type != "flash") {
      delete params.startTime;
      delete params.endTime;
    }
    params.description = "";
    if (params.category == "") {
      params.category = document.getElementById(
        "categories-selector-input"
      ).placeholder;
    }

    CTFd.fetch("/api/v1/challenges", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(function (response) {
        console.log("hello2");
        return response.json();
      })
      .then(function (response) {
        if (response.success) {
          if (response.data.type == "manualRecursive") {
            const params = {
              value: "Récursif",
              challenge: response.data.id,
            };
            CTFd.api.post_tag_list({}, params).then((response) => {});
          }
          if (response.data.type == "flash") {
            const params = {
              value: "Flash",
              challenge: response.data.id,
            };
            CTFd.api.post_tag_list({}, params).then((response) => {});
          }
          setTimeout(function () {
            window.location.reload(true);
          }, 500);
        } else {
          let body = "";
          for (const k in response.errors) {
            body += response.errors[k].join("\n");
            body += "\n";
          }

          ezAlert({
            title: "Error",
            body: body,
            button: "OK",
          });
        }
      });
  }

  // Handle form submission
  document
    .getElementById("submit-button")
    .addEventListener("click", function (event) {
      event.preventDefault();
      loadAndhandleChallenge();
    });
  document
    .getElementById("challenge-create-options-quick-selector")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        loadAndhandleChallenge();
      }
    });

  // Handle form submission
  // document.getElementById('create-challenge-form').addEventListener('submit', function(event) {
  //   console.log("New challenge form!")
  //   event.preventDefault(); // Prevent the default form submission
  //   const formData = new FormData(this); // Create a FormData object from the form

  //   const formDataObject = {};
  //   formData.forEach((value, key) => {
  //       formDataObject[key] = value;
  //   });

  //   // Convert plain object to JSON
  //   const jsonFormData = JSON.stringify(formDataObject);

  // Use fetch API to send the form data
  // fetch(this.action, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: jsonFormData
  // }).then(response => response.json()).then(data => {
  //   // Handle the response data
  //   if (data.success) {
  //     alert('Challenge added successfully!');
  //     // Optionally, redirect or update the UI
  //   } else {
  //     alert('Error adding challenge: ' + data.errors);
  //   }
  // }).catch(error => {
  //   console.error('Error:', error);
  // });
  //   });
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
          })
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
          })
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
