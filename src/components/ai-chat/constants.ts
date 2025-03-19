
export const SUGGESTED_QUERIES = [
  {
    label: "Set my CI",
    query: "I would like to set up my CI to work with you, can you please assist me to do it."
  },
  {
    label: "My Packages",
    query: "What are the most common packages being used in my organization in the last 30 days?"
  },
  {
    label: "Package Catalog",
    query: "Can you find a package that does HTTP requests with good security?"
  },
  {
    label: "Check vulnerabilities",
    query: "Identify what packages are vulnerable and used in my organization"
  }
];

export const INITIAL_MESSAGES: Message[] = [];

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}
