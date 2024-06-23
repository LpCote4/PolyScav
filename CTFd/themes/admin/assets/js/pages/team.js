import "./main";
import $ from "jquery";
import "../compat/json";
import "../compat/format";
import CTFd from "../compat/CTFd";
import { htmlEntities } from "@ctfdio/ctfd-js/utils/html";
import { ezAlert, ezQuery, ezBadge } from "../compat/ezq";
import { createGraph, updateGraph } from "../compat/graphs";
import Vue from "vue";
import CommentBox from "../components/comments/CommentBox.vue";
import UserAddForm from "../components/teams/UserAddForm.vue";
import { copyToClipboard } from "../compat/ui";

window.CTFd = CTFd;
window.carouselPosition = 0;
window.carouselMax = 0;

async function showProvided(element) {
  let provide = element.id;

  let mediaContents;
  try {
    mediaContents = JSON.parse(provide);
  } catch {}
  //si media content est defis c que le provied est des photos/video
  //sinon c autre chose genre du texte
  if (mediaContents) {
    let thumbsnailAvailable = false;
    for (let i = 0; i < mediaContents.length; i++) {
      if (mediaContents[i]["type"] == "thumbsnail") {
        thumbsnailAvailable = true;
        let thumbsnail = createMediaElement(mediaContents[i]);
        thumbsnail.style.width = "50px";
        thumbsnail.style.height = "auto";
        element.appendChild(thumbsnail);
        element.onclick = showLargeSubmissions;
      }
    }
    if (!thumbsnailAvailable) {
      let text = document.createElement("p");
      text.textContent = "No thumbsnail Available for the current media";
      element.appendChild(text);
    }
  } else {
    let text = document.createElement("p");
    text.textContent = provide;
    element.appendChild(text);
  }
}
function createMediaElement(mediaContent) {
  let htmlElement;
  if (mediaContent["type"] == "video/mp4") {
    htmlElement = document.createElement("video");
    htmlElement.controls = true;
    htmlElement.type = "video/mp4";
  } else if (
    mediaContent["type"] == "image/png" ||
    mediaContent["type"] == "thumbsnail"
  ) {
    htmlElement = document.createElement("img");
    htmlElement.type = "image/png";
  }
  htmlElement.src = "/files/" + mediaContent["location"];

  return htmlElement;
}

function createTeam(event) {
  event.preventDefault();
  const params = $("#team-info-create-form").serializeJSON(true);

  params.fields = [];

  for (const property in params) {
    if (property.match(/fields\[\d+\]/)) {
      let field = {};
      let id = parseInt(property.slice(7, -1));
      field["field_id"] = id;
      field["value"] = params[property];
      params.fields.push(field);
      delete params[property];
    }
  }

  CTFd.fetch("/api/v1/teams", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      if (response.success) {
        const team_id = response.data.id;
        window.location = CTFd.config.urlRoot + "/admin/teams/" + team_id;
      } else {
        $("#team-info-create-form > #results").empty();
        Object.keys(response.errors).forEach(function (key, _index) {
          $("#team-info-create-form > #results").append(
            ezBadge({
              type: "error",
              body: response.errors[key],
            })
          );
          const i = $("#team-info-create-form").find(
            "input[name={0}]".format(key)
          );
          const input = $(i);
          input.addClass("input-filled-invalid");
          input.removeClass("input-filled-valid");
        });
      }
    });
}

function updateTeam(event) {
  event.preventDefault();
  let params = $("#team-info-edit-form").serializeJSON(true);

  params.fields = [];

  for (const property in params) {
    if (property.match(/fields\[\d+\]/)) {
      let field = {};
      let id = parseInt(property.slice(7, -1));
      field["field_id"] = id;
      field["value"] = params[property];
      params.fields.push(field);
      delete params[property];
    }
  }

  CTFd.fetch("/api/v1/teams/" + window.TEAM_ID, {
    method: "PATCH",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      if (response.success) {
        window.location.reload();
      } else {
        $("#team-info-form > #results").empty();
        Object.keys(response.errors).forEach(function (key, _index) {
          $("#team-info-form > #results").append(
            ezBadge({
              type: "error",
              body: response.errors[key],
            })
          );
          const i = $("#team-info-form").find("input[name={0}]".format(key));
          const input = $(i);
          input.addClass("input-filled-invalid");
          input.removeClass("input-filled-valid");
        });
      }
    });
}

function showLargeSubmissions(_event) {
  window.carouselPosition = 0;
  let mediaContents;
  try {
    mediaContents = JSON.parse(_event.srcElement.id);
  } catch {
    mediaContents = JSON.parse(_event.srcElement.parentElement.id);
  }
  let decalage = false;
  let images = mediaContents;

  window.carouselMax = mediaContents.length - 1;
  let imagesHTML =
    "<section class='slider-wrapper'><ul class='slides-container list-unstyled' style:'list-style: none !important;' id='slides-container'>";
  for (let i = 0; i < mediaContents.length; i++) {
    if (mediaContents[i]["type"] != "thumbsnail") {
      let element = createMediaElement(mediaContents[i]);
      element.style.width = "100%";
      element.style.objectFit = "contain";
      element.style.height = "500px";

      let lambda = document.createElement("div");
      lambda.append(element);
      imagesHTML +=
        `<li class="slide ` +
        (decalage ? i - 1 : i) +
        "slide" +
        `" style="min-height:50%">`;
      imagesHTML += lambda.innerHTML;
      imagesHTML += `</li>`;
    } else {
      decalage = true;
    }
  }
  imagesHTML += "</ul></section>";
  imagesHTML +=
    "<img src onerror='reloadCarousel(this.parentElement);'><button class='btn btn-primary carousel__navigation-button slide-arrow-prev' id='slide-arrow-prev' onclick='downCarousel(this)' style='display:block;position:absolute;top:40%;left:1rem;'>" +
    `<svg viewBox="0 0 100 100"><path d="M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z" class="arrow" fill="white" transform="translate(15,0) rotate(0)"></path></svg>` +
    "</button><button style='position:absolute;top:40%;right:1rem;' class='btn btn-primary carousel__navigation-button slide-arrow-next' id='slide-arrow-next' onclick='upCarousel(this)'>" +
    `<svg viewBox="0 0 100 100"><path d="M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z" class="arrow" fill="white" transform="translate(85,100) rotate(180)"></path></svg>` +
    "</button>";
  ezAlert({
    title: "Visioneurs",
    body: imagesHTML,
    button: "retour",
    additionalClassMain: "FullSizeCarousel",
  });
  document.getElementsByClassName("modal-dialog")[0].style.listStyle = "none";
}
window.upCarousel = function (self) {
  window.carouselPosition += 1;
  if (window.carouselPosition != window.carouselMax - 1) {
    window.reloadCarousel(self.parentElement);
    self.parentElement.getElementsByClassName("slide-arrow-prev")[0].hidden =
      false;
  } else {
    window.reloadCarousel(self.parentElement);
    self.parentElement.getElementsByClassName("slide-arrow-next")[0].hidden =
      true;
    self.parentElement.getElementsByClassName("slide-arrow-prev")[0].hidden =
      false;
  }
};
window.downCarousel = function (self) {
  window.carouselPosition -= 1;

  if (window.carouselPosition != 0) {
    window.reloadCarousel(self.parentElement);
    self.parentElement.getElementsByClassName("slide-arrow-next")[0].hidden =
      false;
  } else {
    window.reloadCarousel(self.parentElement);
    self.parentElement.getElementsByClassName("slide-arrow-prev")[0].hiddend =
      true;
    self.parentElement.getElementsByClassName("slide-arrow-next")[0].hidden =
      false;
  }
};
window.reloadCarousel = function (element) {
  if (window.carouselPosition == 0) {
    element.getElementsByClassName("slide-arrow-prev")[0].hidden = true;
  }
  if (window.carouselMax == 1) {
    element.getElementsByClassName("slide-arrow-next")[0].hidden = true;
  }

  for (let i = 0; i < window.carouselMax; i++) {
    if (i == window.carouselPosition) {
      element.getElementsByClassName(i + "slide")[0].hidden = false;
    } else {
      element.getElementsByClassName(i + "slide")[0].hidden = true;

      let child = element.getElementsByClassName(i + "slide")[0].firstChild;

      if (child.nodeName == "VIDEO") {
        child.pause();
      }
    }
  }
};

function correctSubmissions(_event) {
  let submissions = $("input[data-submission-type=incorrect]:checked");
  let submissionIDs = submissions.map(function () {
    return $(this).data("submission-id");
  });
  let target = submissionIDs.length === 1 ? "submission" : "submissions";

  ezQuery({
    title: "Correct Submissions",
    body: `Are you sure you want to mark ${submissionIDs.length} ${target} correct?`,
    success: function () {
      const reqs = [];
      for (var subId of submissionIDs) {
        let req = CTFd.fetch(`/api/v1/submissions/${subId}`, {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "correct" }),
        });
        reqs.push(req);
      }
      Promise.all(reqs).then((_responses) => {
        window.location.reload();
      });
    },
  });
}

function deleteSelectedSubmissions(event, target) {
  let submissions;
  let type;
  let title;
  switch (target) {
    case "solves":
      submissions = $("input[data-submission-type=correct]:checked");
      type = "solve";
      title = "Solves";
      break;
    case "fails":
      submissions = $("input[data-submission-type=incorrect]:checked");
      type = "fail";
      title = "Fails";
      break;
    default:
      break;
  }

  let submissionIDs = submissions.map(function () {
    return $(this).data("submission-id");
  });
  let target_string = submissionIDs.length === 1 ? type : type + "s";

  ezQuery({
    title: `Delete ${title}`,
    body: `Are you sure you want to delete ${submissionIDs.length} ${target_string}? (If the challenge has already been approved, please also delete it in the submissions tabs.)`,
    success: function () {
      const reqs = [];
      for (var subId of submissionIDs) {
        reqs.push(CTFd.api.delete_submission({ submissionId: subId }));
      }
      Promise.all(reqs).then((_responses) => {
        window.location.reload();
      });
    },
  });
}

function deleteSelectedAwards(_event) {
  let awardIDs = $("input[data-award-id]:checked").map(function () {
    return $(this).data("award-id");
  });
  let target = awardIDs.length === 1 ? "award" : "awards";

  ezQuery({
    title: `Delete Awards`,
    body: `Are you sure you want to delete ${awardIDs.length} ${target}?`,
    success: function () {
      const reqs = [];
      for (var awardID of awardIDs) {
        let req = CTFd.fetch("/api/v1/awards/" + awardID, {
          method: "DELETE",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        reqs.push(req);
      }
      Promise.all(reqs).then((_responses) => {
        window.location.reload();
      });
    },
  });
}

function solveSelectedMissingChallenges(event) {
  event.preventDefault();
  let challengeIDs = $("input[data-missing-challenge-id]:checked").map(
    function () {
      return $(this).data("missing-challenge-id");
    }
  );
  let target = challengeIDs.length === 1 ? "challenge" : "challenges";

  ezQuery({
    title: `Mark Correct`,
    body: `Are you sure you want to mark ${
      challengeIDs.length
    } ${target} correct for ${htmlEntities(window.TEAM_NAME)}?`,
    success: function () {
      ezAlert({
        title: `User Attribution`,
        body: `
        Which user on ${htmlEntities(window.TEAM_NAME)} solved these challenges?
        <div class="pb-3" id="query-team-member-solve">
        ${$("#team-member-select").html()}
        </div>
        `,
        button: "Mark Correct",
        success: function () {
          const USER_ID = $("#query-team-member-solve > select").val();
          const reqs = [];
          for (var challengeID of challengeIDs) {
            let params = {
              provided: "MARKED AS SOLVED BY ADMIN",
              user_id: USER_ID,
              team_id: window.TEAM_ID,
              challenge_id: challengeID,
              type: "correct",
            };

            let req = CTFd.fetch("/api/v1/submissions", {
              method: "POST",
              credentials: "same-origin",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(params),
            });
            reqs.push(req);
          }
          Promise.all(reqs).then((_responses) => {
            window.location.reload();
          });
        },
      });
    },
  });
}

const api_funcs = {
  team: [
    (x) => CTFd.api.get_team_solves({ teamId: x }),
    (x) => CTFd.api.get_team_fails({ teamId: x }),
    (x) => CTFd.api.get_team_awards({ teamId: x }),
  ],

  user: [
    (x) => CTFd.api.get_user_solves({ userId: x }),
    (x) => CTFd.api.get_user_fails({ userId: x }),
    (x) => CTFd.api.get_user_awards({ userId: x }),
  ],
};

const createGraphs = (type, id, name, account_id) => {
  let [solves_func, fails_func, awards_func] = api_funcs[type];

  Promise.all([
    solves_func(account_id),
    fails_func(account_id),
    awards_func(account_id),
  ]).then((responses) => {
    createGraph(
      "score_graph",
      "#score-graph",
      responses,
      type,
      id,
      name,
      account_id
    );
    createGraph(
      "category_breakdown",
      "#categories-pie-graph",
      responses,
      type,
      id,
      name,
      account_id
    );
    createGraph(
      "solve_percentages",
      "#keys-pie-graph",
      responses,
      type,
      id,
      name,
      account_id
    );
  });
};

const updateGraphs = (type, id, name, account_id) => {
  let [solves_func, fails_func, awards_func] = api_funcs[type];

  Promise.all([
    solves_func(account_id),
    fails_func(account_id),
    awards_func(account_id),
  ]).then((responses) => {
    updateGraph(
      "score_graph",
      "#score-graph",
      responses,
      type,
      id,
      name,
      account_id
    );
    updateGraph(
      "category_breakdown",
      "#categories-pie-graph",
      responses,
      type,
      id,
      name,
      account_id
    );
    updateGraph(
      "solve_percentages",
      "#keys-pie-graph",
      responses,
      type,
      id,
      name,
      account_id
    );
  });
};

$(() => {
  $("#team-captain-form").submit(function (e) {
    e.preventDefault();
    const params = $("#team-captain-form").serializeJSON(true);

    CTFd.fetch("/api/v1/teams/" + window.TEAM_ID, {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        if (response.success) {
          window.location.reload();
        } else {
          $("#team-captain-form > #results").empty();
          Object.keys(response.errors).forEach(function (key, _index) {
            $("#team-captain-form > #results").append(
              ezBadge({
                type: "error",
                body: response.errors[key],
              })
            );
            const i = $("#team-captain-form").find(
              "select[name={0}]".format(key)
            );
            const input = $(i);
            input.addClass("input-filled-invalid");
            input.removeClass("input-filled-valid");
          });
        }
      });
  });

  $(".edit-team").click(function (_e) {
    $("#team-info-edit-modal").modal("toggle");
  });

  $(".invite-team").click(function (_e) {
    CTFd.fetch(`/api/v1/teams/${window.TEAM_ID}/members`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        if (response.success) {
          let code = response.data.code;
          let url = `${window.location.origin}${CTFd.config.urlRoot}/teams/invite?code=${code}`;
          $("#team-invite-modal input[name=link]").val(url);
          $("#team-invite-modal").modal("toggle");
        }
      });
  });

  $("#team-invite-link-copy").click(function (e) {
    copyToClipboard(e, "#team-invite-link");
  });

  let elements = document.getElementsByClassName("imageContainer");
  for (let i = 0; i < elements.length; i++) {
    showProvided(elements[i]);
  }

  $(".members-team").click(function (_e) {
    $("#team-add-modal").modal("toggle");
  });

  $(".edit-captain").click(function (_e) {
    $("#team-captain-modal").modal("toggle");
  });

  $(".award-team").click(function (_e) {
    $("#team-award-modal").modal("toggle");
  });

  $(".addresses-team").click(function (_event) {
    $("#team-addresses-modal").modal("toggle");
  });

  $("#user-award-form").submit(function (e) {
    e.preventDefault();
    const params = $("#user-award-form").serializeJSON(true);
    params["user_id"] = $("#award-member-input").val();
    params["team_id"] = window.TEAM_ID;

    $("#user-award-form > #results").empty();

    if (!params["user_id"]) {
      $("#user-award-form > #results").append(
        ezBadge({
          type: "error",
          body: "Please select a team member",
        })
      );
      return;
    }
    params["user_id"] = parseInt(params["user_id"]);

    CTFd.fetch("/api/v1/awards", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        if (response.success) {
          window.location.reload();
        } else {
          $("#user-award-form > #results").empty();
          Object.keys(response.errors).forEach(function (key, _index) {
            $("#user-award-form > #results").append(
              ezBadge({
                type: "error",
                body: response.errors[key],
              })
            );
            const i = $("#user-award-form").find("input[name={0}]".format(key));
            const input = $(i);
            input.addClass("input-filled-invalid");
            input.removeClass("input-filled-valid");
          });
        }
      });
  });

  $(".delete-member").click(function (e) {
    e.preventDefault();
    const member_id = $(this).attr("member-id");
    const member_name = $(this).attr("member-name");

    const params = {
      user_id: member_id,
    };

    const row = $(this).parent().parent();

    ezQuery({
      title: "Remove Member",
      body: "Are you sure you want to remove {0} from {1}? <br><br><strong>All of their challenge solves, attempts, awards, and unlocked hints will also be deleted!</strong>".format(
        "<strong>" + htmlEntities(member_name) + "</strong>",
        "<strong>" + htmlEntities(window.TEAM_NAME) + "</strong>"
      ),
      success: function () {
        CTFd.fetch("/api/v1/teams/" + window.TEAM_ID + "/members", {
          method: "DELETE",
          body: JSON.stringify(params),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (response) {
            if (response.success) {
              row.remove();
            }
          });
      },
    });
  });

  $(".delete-team").click(function (_e) {
    ezQuery({
      title: "Delete Team",
      body: "Are you sure you want to delete {0}".format(
        "<strong>" + htmlEntities(window.TEAM_NAME) + "</strong>"
      ),
      success: function () {
        CTFd.fetch("/api/v1/teams/" + window.TEAM_ID, {
          method: "DELETE",
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (response) {
            if (response.success) {
              window.location = CTFd.config.urlRoot + "/admin/teams";
            }
          });
      },
    });
  });

  $("#solves-delete-button").click(function (e) {
    deleteSelectedSubmissions(e, "solves");
  });

  $("#correct-fail-button").click(correctSubmissions);

  $("#fails-delete-button").click(function (e) {
    deleteSelectedSubmissions(e, "fails");
  });

  $("#correct-submissions-button").click(correctSubmissions);

  $("#submissions-delete-button").click(function (e) {
    deleteSelectedSubmissions(e, "fails");
  });

  $("#awards-delete-button").click(function (e) {
    deleteSelectedAwards(e);
  });

  $("#missing-solve-button").click(function (e) {
    solveSelectedMissingChallenges(e);
  });

  $("#team-info-create-form").submit(createTeam);

  $("#team-info-edit-form").submit(updateTeam);

  // Insert CommentBox element
  const commentBox = Vue.extend(CommentBox);
  let vueContainer = document.createElement("div");
  document.querySelector("#comment-box").appendChild(vueContainer);
  new commentBox({
    propsData: { type: "team", id: window.TEAM_ID },
  }).$mount(vueContainer);

  // Insert team member addition form
  const userAddForm = Vue.extend(UserAddForm);
  let memberFormContainer = document.createElement("div");
  document
    .querySelector("#team-add-modal .modal-body")
    .appendChild(memberFormContainer);
  new userAddForm({
    propsData: { team_id: window.TEAM_ID },
  }).$mount(memberFormContainer);

  let type, id, name, account_id;
  ({ type, id, name, account_id } = window.stats_data);

  let intervalId;
  $("#team-statistics-modal").on("shown.bs.modal", function (_e) {
    createGraphs(type, id, name, account_id);
    intervalId = setInterval(() => {
      updateGraphs(type, id, name, account_id);
    }, 300000);
  });

  $("#team-statistics-modal").on("hidden.bs.modal", function (_e) {
    clearInterval(intervalId);
  });

  $(".statistics-team").click(function (_event) {
    $("#team-statistics-modal").modal("toggle");
  });
});
