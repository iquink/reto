import apiClient from "../api";

const PATH = "/issues";

/**
 * Issues API for handling CRUD operations on issues.
 *
 * This module provides methods to create, fetch, update, and delete issues.
 */
const issuesApi = {
  /**
   * Creates a new issue.
   * @param data - Issue data: title, description, photos (array), coordinates (string)
   * @returns The created issue object.
   */
  async createIssue(data: {
    title: string;
    description?: string;
    photos?: string[];
    coordinates?: string;
    files?: FileList | null;
  }) {
    console.log("Issue created:", data);
    const response = await apiClient.post(PATH, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Fetches all issues for the current user.
   * @returns Array of issue objects.
   */
  async getUserIssues() {
    const response = await apiClient.get(PATH, { withCredentials: true });
    return response.data;
  },

  /**
   * Fetches a single issue by its ID.
   * @param id - Issue ID
   * @returns The issue object.
   */
  async getIssueById(id: number) {
    const response = await apiClient.get(`${PATH}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Updates an existing issue.
   * @param id - Issue ID
   * @param data - Fields to update: title, description, photos, coordinates
   * @returns The updated issue object or status.
   */
  async updateIssue(
    id: number,
    data: {
      title?: string;
      description?: string;
      photos?: string[];
      coordinates?: string;
      status?: string;
    }
  ) {
    const response = await apiClient.put(`${PATH}/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Deletes an issue by its ID.
   * @param id - Issue ID
   * @returns Status message.
   */
  async deleteIssue(id: number) {
    const response = await apiClient.delete(`${PATH}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },
};

export default issuesApi;
