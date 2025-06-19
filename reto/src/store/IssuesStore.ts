import { cast, types, flow, Instance } from "mobx-state-tree";
import { IssueModel, UserIssuesListItemModel } from "./models";
import { issuesApi } from "@api/index";

// Issue interface (TypeScript type for IssueModel)
export type TIssue = Instance<typeof IssueModel>;
export type TUserIssue = Instance<typeof UserIssuesListItemModel>;

// Define the IssuesStore model
export const IssuesStore = types
  .model("IssuesStore", {
    selectedLocation: types.maybeNull(types.array(types.number)),
    currentIssue: types.maybeNull(IssueModel),
    issues: types.optional(types.array(IssueModel), []),
    userIssues: types.optional(types.array(UserIssuesListItemModel), []),
  })
  .actions((self) => ({
    setSelectedLocation(location: number[] | null) {
      self.selectedLocation = location ? cast(location) : null;
    },
    clearSelectedLocation() {
      self.selectedLocation = null;
    },
    setCurrentIssue(issue: TIssue | null) {
      self.currentIssue = issue ? cast(issue) : null;
    },
    setIssues(issues: TIssue[]) {
      self.issues = cast(issues);
    },
    clearIssues() {
      self.issues.clear();
    },
    setUserIssues(issues: TUserIssue[]) {
      self.userIssues = cast(issues);
    },
    clearUserIssues() {
      self.userIssues.clear();
    },
    clearCurrentIssue() {
      self.currentIssue = null;
    },
  }))
  .actions((self) => ({
    // Fetch a single issue by id and set as currentIssue
    getIssue: flow(function* (id: number) {
      try {
        const data = yield issuesApi.getIssueById(id);
        self.setCurrentIssue(data);
      } catch (error) {
        console.error("Failed to fetch issue:", error);
        self.setCurrentIssue(null);
      }
    }),
    // Add a new issue and push it to the issues list
    addIssue: flow(function* (issueData: {
      title: string;
      description: string;
      photos?: string[];
      coordinates?: string;
      files?: FileList | null;
    }) {
      try {
        const response = yield issuesApi.createIssue(issueData);
        self.setCurrentIssue(response);
      } catch (error) {
        console.error("Failed to add issue:", error);
      }
    }),
    // Fetch all issues and set them in the store
    getUserIssues: flow(function* () {
      try {
        const data = yield issuesApi.getUserIssues();
        self.setUserIssues(data);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
        self.clearUserIssues();
      }
    }),
    getIssueById: flow(function* (id: number) {
      try {
        const data = yield issuesApi.getIssueById(id);
        self.setCurrentIssue(data);
      } catch (error) {
        console.error("Failed to fetch issue by ID:", error);
        self.setCurrentIssue(null);
      }
    }),
  }))
  .actions((self) => ({
    // Update an existing issue
    updateIssue: flow(function* (
      id: number,
      updateData: {
        title?: string;
        description?: string;
        photos?: string[];
        coordinates?: string;
        status?: string;
      }
    ) {
      try {
        const updated = yield issuesApi.updateIssue(id, updateData);

        self.getIssueById(id);

        return updated;
      } catch (error) {
        console.error("Failed to update issue:", error);
        throw error;
      }
    }),
  }));
