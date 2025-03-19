
export const SUGGESTED_QUERIES = [
  {
    label: "Set my CI",
    query: "I would like to set up my CI to work with JFrog. Can you set it up for me?"
  },
  {
    label: "My packages",
    query: "What are the most common packages used in my organization in the last 30 days?"
  },
  {
    label: "Open source packages",
    query: "Can you find a package that handles HTTP requests without critical vulnerabilities?"
  },
  {
    label: "Check vulnerabilities",
    query: "Identify which packages are vulnerable and currently used in my organization."
  }
];

export const INITIAL_MESSAGES: Message[] = [];

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}
