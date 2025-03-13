
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
    query: "abc"
  },
  {
    label: "SBOM",
    query: "Can I get an SBOM report for my packages from the last 30 days?"
  }
];

export const INITIAL_MESSAGES: Message[] = [];

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

