import { cast, types, flow, Instance } from "mobx-state-tree";
import { IssueModel } from "./models";
import issuesApi from "../api/issuesApi";

// Issue interface (TypeScript type for IssueModel)
export interface IIssue extends Instance<typeof IssueModel> {}

// Define the IssuesStore model
export const IssuesStore = types
  .model("IssuesStore", {
    selectedLocation: types.maybeNull(types.array(types.number)),
    currentIssue: types.maybeNull(IssueModel),
    issues: types.optional(types.array(IssueModel), []),
  })
  .actions((self) => ({
    setSelectedLocation(location: number[] | null) {
      self.selectedLocation = location ? cast(location) : null;
    },
    clearSelectedLocation() {
      self.selectedLocation = null;
    },
    setCurrentIssue(issue: IIssue | null) {
      self.currentIssue = issue ? cast(issue) : null;
    },
    setIssues(issues: IIssue[]) {
      self.issues = cast(issues);
    },
    clearIssues() {
      self.issues.clear();
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
    }) {
      try {
        const data = yield issuesApi.createIssue(issueData);
        // TODO: get the issue from the server and cast it to IssueModel
        // self.issues.unshift(cast(data));
      } catch (error) {
        console.error("Failed to add issue:", error);
      }
    }),
  }));
