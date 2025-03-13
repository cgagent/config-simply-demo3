
export const SUGGESTED_QUERIES = [
  {
    label: "CI Setup",
    query: "I would like to set up my CI to work with you, can you please assist me to do it."
  },
  {
    label: "Org Packages",
    query: "What are the most popular package being used in my organization? is it secured?"
  },
  {
    label: "Public package",
    query: "recommend me for 3 npm packages for making http requests."
  },
  {
    label: "Blocked Packages",
    query: "Which packages were blocked in the last 2 weeks?"
  },
  {
    label: "Sbom",
    query: "Generate an Sbom report for the last 30 days"
  },
  {
    label: "abc",
    query: "What is abc?"
  }
];

export const INITIAL_MESSAGES: Message[] = [];

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}
