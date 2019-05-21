import gql from "graphql-tag";

export const SAVE_DRAFT = gql`
  mutation addDraft(
    $id: String!
    $title: String
    $body: String
    $json: String
    $isCodeEditor: Boolean
  ) {
    addDraft(
      id: $id
      title: $title
      body: $body
      json: $json
      isCodeEditor: $isCodeEditor
    ) {
      success
      message
    }
  }
`;

export const DELETE_DRAFT = gql`
  mutation deleteDraft($id: String!) {
    deleteDraft(id: $id) {
      success
      message
    }
  }
`;

export const GET_DRAFTS = gql`
  query drafts($offset: Int, $limit: Int) {
    drafts(offset: $offset, limit: $limit) {
      id
      savedate
      title
      body
      json
      isCodeEditor
    }
  }
`;
