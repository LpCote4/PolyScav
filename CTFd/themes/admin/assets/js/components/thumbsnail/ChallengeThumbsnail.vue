<template>
  <div>
    <table id="Thumbsnailboard" class="table table-striped">
      <thead>
        <tr>
          <td class="text-center"><b>Thumbsnail</b></td>
          <td class="text-center"><b>Settings</b></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="file in files" :key="file.id">
          <td class="text-center">
            <a :href="`${urlRoot}/files/${file.location}`">{{
              file.location.split("/").pop()
            }}</a>
          </td>

          <td class="text-center">
            <i
              role="button"
              class="btn-fa fas fa-times delete-file"
              @click="deleteFile(file.id)"
            ></i>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="col-md-12 mt-3">
      <form id="thumbsnail-upload-form" class="form-upload" method="POST" enctype="multipart/form-data">
        <button id="btn-file-input" class="btn btn-secondary" type="button">Select File</button>
        <img id="image-preview" :src="CHALLENGE_THUMBSNAIL" v-show="CHALLENGE_THUMBSNAIL" style="width: 100px; height: 100px; margin-top: 10px;">
        <input class="form-control-file" id="thumbsnail-get-path" name='file' type='file' accept="image/*" style="display: none;">
        <input type="hidden" id="thumbsnail-path" name="thumbsnail">
      </form>
    </div>
  </div>
</template>

<script>
import { ezQuery } from "../../compat/ezq";
import { default as helpers } from "../../compat/helpers";
import CTFd from "../../compat/CTFd";

export default {
  props: {
    challengeId: Number,
    challengeName: String,
    CHALLENGE_THUMBSNAIL: String
  },
  data: function () {
    return {
      files: [],
      urlRoot: CTFd.config.urlRoot,
    };
  },
  methods: {
    updateThumbsnailPath(imgPath) {
      CTFd.fetch(`/api/v1/challenges/${CHALLENGE_ID}/thumbsnail`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thumbsnail: imgPath }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            console.log('Thumbsnail path updated successfully.');
          } else {
            console.error('Failed to update thumbsnail path:', response.message);
          }
        });
    },
  },
  mounted() {
    document.getElementById('btn-file-input').style.display = "block";

    document.getElementById('btn-file-input').addEventListener('click', () => {
      document.getElementById('thumbsnail-get-path').click();
    });

    document.getElementById('thumbsnail-get-path').addEventListener('change', (event) => {
      const file = event.target.files[0];
      let form = document.getElementById('thumbsnail-upload-form');
      const formData = new FormData(form);
      formData.append('file', file);

      helpers.files.upload(formData, form, (response) => {
        const f = response.data[0];
        const imgPath = CTFd.config.urlRoot + "/files/" + f.location;
        document.getElementById('thumbsnail-path').value = imgPath;
        console.log('Thumbnail uploaded successfully:', imgPath);

        const img = document.getElementById('image-preview');
        img.src = imgPath;
        img.style.display = 'block';

        this.updateThumbsnailPath(imgPath);
      });

      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = document.getElementById('image-preview');
          img.src = event.target.result;
          img.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }
};
</script>

<style scoped></style>
