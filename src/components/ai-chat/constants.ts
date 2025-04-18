
export const SUGGESTED_QUERIES = [
  {
    label: "Set my CI",
    query: "I would like to set up my CI to work with JFrog. Can you set it up for me?"
  },
  {
    label: "Check for risks",
    query: "Identify which packages are at risk in my organization"
  },
  {
    label: "Create a release",
    query: "I would like to release a new package. Can you help me with that?"
  },
  {
    label: "Invite a user",
    query: "I would like to invite a user to my organization. Can you help me with that?"
  }
];

export const INITIAL_MESSAGES: Message[] = [];

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}
