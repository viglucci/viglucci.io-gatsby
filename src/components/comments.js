import React, { useState, useEffect } from "react";
import { DiscussionEmbed } from "disqus-react";
import PropTypes from "prop-types";

function Comments({ shortname, config }) {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    if (window && !window.document.getElementById("dsq-embed-scr")) {
      const target = window.document.getElementById("comment__container");
      const options = {
        root: null,
        rootMargin: "0% 0% 100% 0%",
        threshold: 0,
      };
      const callback = function (entries, observer) {
        if (entries && entries[0]?.isIntersecting) {
          observer.unobserve(target);
          setVisible(true);
        }
      };
      const observer = new IntersectionObserver(callback, options);
      observer.observe(target);
    }
  }, []);

  return (
    <div style={{ display: "block" }} id="comment__container">
      {isVisible ? <DiscussionEmbed {...{ shortname, config }} /> : <p>Loading Comments...</p>}
    </div>
  );
}

Comments.propTypes = {
  shortname: PropTypes.string,
  config: PropTypes.shape({
    identifier: PropTypes.string,
    url: PropTypes.string,
    title: PropTypes.string,
  }),
};

export default Comments;
