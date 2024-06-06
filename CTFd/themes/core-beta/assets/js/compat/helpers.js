import $ from "jquery";

import { default as ezq } from "./ezq";
import { htmlEntities } from "@ctfdio/ctfd-js/utils/html";
import { colorHash } from "./styles";
import { copyToClipboard } from "./ui";

const utils = {
  htmlEntities: htmlEntities,
  colorHash: colorHash,
  copyToClipboard: copyToClipboard,
};

const comments = {
  get_comments: (extra_args) => {
    const CTFd = window.CTFd;
    return CTFd.fetch("/api/v1/comments?" + $.param(extra_args), {
      method: "GET",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(function (response) {
      return response.json();
    });
  },
  add_comment: (comment, type, extra_args, cb) => {
    const CTFd = window.CTFd;
    let body = {
      content: comment,
      type: type,
      ...extra_args,
    };
    CTFd.fetch("/api/v1/comments", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        if (cb) {
          cb(response);
        }
      });
  },
  delete_comment: (comment_id) => {
    const CTFd = window.CTFd;
    return CTFd.fetch(`/api/v1/comments/${comment_id}`, {
      method: "DELETE",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(function (response) {
      return response.json();
    });
  },
};

const helpers = {
  comments,
  utils,
  ezq,
};

export default helpers;
