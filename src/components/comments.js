import React from "react";
import { DiscussionEmbed } from "disqus-react";
import PropTypes from "prop-types";

function Comments({
    shortname,
    config
}) {
    return (
        <DiscussionEmbed {...{shortname, config}} />
    );
}

Comments.propTypes = {
    shortname: PropTypes.string,
    config: PropTypes.shape({
        identifier: PropTypes.string,
        url: PropTypes.string,
        title: PropTypes.string,
    })
};

export default Comments;