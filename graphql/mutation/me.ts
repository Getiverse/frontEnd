import { gql } from "@apollo/client";
export const FOLLOW = gql`
  mutation Follow($type: String!) {
    follow(userId: $type)
  }
`;
export type FOLLOW = {
  follow: string[];
};
export const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser {
      id
    }
  }
`;
export type DELETE_USER = {
  deleteUser: {
    id: string;
  };
};

export const UPDATE_PROFILE = gql`
  mutation UpdateMyProfile($type: UpdateUserInput!) {
    updateMyProfile(input: $type) {
      id
    }
  }
`;

export const UPDATE_LIBRARY = gql`
  mutation UpdateLibrary($type: updateLibraryInput!) {
    updateLibrary(input: $type) {
      id
    }
  }
`;

export const REMOVE_LIBRARY = gql`
  mutation RemoveLibrary($type: String!) {
    removeLibrary(id: $type) {
      id
    }
  }
`;

export type REMOVE_LIBRARY = {
  removeLibrary: {
    id: string;
  };
};

export const SAVE_TO = gql`
  mutation SaveTo(
    $libraryIds: [String!]!
    $postId: String!
    $postType: PostType!
  ) {
    saveTo(libraryIds: $libraryIds, postId: $postId, postType: $postType)
  }
`;

export type SAVE_TO = {
  saveTo: boolean;
};

export const ADD_RATING = gql`
  mutation AddRating($type: createRatingInput!) {
    addRating(input: $type) {
      id
      createdAt
    }
  }
`;
export type ADD_RATING = {
  addRating: {
    id: string;
    createdAt: string;
  };
};

export const SET_USEFUL_RATING = gql`
  mutation SetUsefulRating($type: String!) {
    setUsefulRating(ratingId: $type) {
      id
    }
  }
`;
export type SET_USEFUL_RATING = {
  setUsefulRating: {
    id: string;
  };
};
export const SET_NOT_USEFUL_RATING = gql`
  mutation SetNotUsefulRating($type: String!) {
    setNotUsefulRating(ratingId: $type) {
      id
    }
  }
`;
export type SET_NOT_USEFUL_RATING = {
  setNotUsefulRating: {
    id: string;
  };
};

export const SET_USEFUL_REPLY = gql`
  mutation SetUsefulReply($type: String!) {
    setUsefulReply(replyId: $type) {
      id
    }
  }
`;
export type SET_USEFUL_REPLY = {
  setUsefulReply: {
    id: string;
  };
};
export const SET_NOT_USEFUL_REPLY = gql`
  mutation SetNotUsefulReply($type: String!) {
    setNotUsefulReply(replyId: $type) {
      id
    }
  }
`;
export type SET_NOT_USEFUL_REPLY = {
  setNotUsefulReply: {
    id: string;
  };
};

export const REMOVE_RATING = gql`
  mutation RemoveReply($type: String!) {
    removeRating(id: $type) {
      id
    }
  }
`;
export type REMOVE_RATING = {
  removeRating: {
    id: string;
  };
};

export const EDIT_RATING = gql`
  mutation EditRating($type: updateRatingInput!) {
    editRating(input: $type) {
      id
      createdAt
    }
  }
`;
export type EDIT_RATING = {
  editRating: {
    id: string;
    createdAt: string;
  };
};

export const ADD_REPLY = gql`
  mutation AddReply($type: createReplyInput!) {
    addReply(input: $type) {
      id
      createdAt
    }
  }
`;
export type ADD_REPLY = {
  addReply: {
    id: string;
    createdAt: string;
  };
};

export const REMOVE_REPLY = gql`
  mutation RemoveReply($type: String!) {
    removeReply(id: $type) {
      id
    }
  }
`;
export type REMOVE_REPLY = {
  removeReply: {
    id: string;
  };
};
export const EDIT_REPLY = gql`
  mutation EditReply($type: UpdateReplyInput!) {
    editReply(input: $type) {
      id
    }
  }
`;
export type EDIT_REPLY = {
  editReply: {
    id: string;
  };
};

export const ADD_REPORT = gql`
  mutation AddReport($type: createReportInput!) {
    addReport(input: $type) {
      id
    }
  }
`;
export type ADD_REPORT = {
  addReport: {
    id: string;
  };
};

export const BLOCK_USER = gql`
  mutation BlockUser($type: String!) {
    blockUser(id: $type) {
      id
    }
  }
`;
export type BLOCK_USER = {
  blockUser: {
    id: string;
  };
};

export const REMOVE_ARTICLE = gql`
  mutation RemoveArticle($type: String!) {
    removeArticle(id: $type) {
      id
    }
  }
`;
export type REMOVE_ARTICLE = {
  removeArticle: {
    id: string;
  };
};

export const REMOVE_INSTANT = gql`
  mutation RemoveInstant($type: String!) {
    removeInstant(id: $type) {
      id
    }
  }
`;
export type REMOVE_INSTANT = {
  removeInstant: {
    id: string;
  };
};
