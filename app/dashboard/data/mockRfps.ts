export const mockRfps = [
  {
    id: "1",
    title: "Drupal Website Revamp for Government Portal",
    description: "Redesign and redevelop an existing Drupal 8 portal to Drupal 10 with accessibility compliance.",
    relevance: 92,
  },
  {
    id: "2",
    title: "React Native App for Education Platform",
    description: "Development of a cross-platform mobile application with React Native and Firebase backend.",
    relevance: 85,
  },
  {
    id: "3",
    title: "GenAI Content Generator for E-commerce",
    description: "AI-powered product description generator for multilingual marketplaces.",
    relevance: 88,
  },
]

export const fetchRfps = async (): Promise<any[]> => {
  try {
    const response = await fetch("http://65.2.128.237:8000/api/v1/rfps/?limit=50");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Transform the API response to match the desired structure
    return data.map((rfp: any) => ({
      id: rfp._id,
      title: rfp.title,
      description: rfp.description || "No description available",
      relevance: rfp.score || 0, // Default to 0 if score is null
      url: rfp.url,
      portalName: rfp.portal_name,
      publishedDate: rfp.published_date || "N/A",
      deadline: rfp.deadline || "N/A",
    }));
  } catch (error) {
    console.error("Failed to fetch RFPs:", error);
    return [];
  }
};
