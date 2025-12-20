export const ViewTypes = {
  sceneContainer: "view.sceneContainer",
  floors: "view.floors",
  elevator: "view.elevator",
  floorsSelector: "view.floorsSelector",
  capacitySelector: "view.capacitySelector",
};

export type ViewType = (typeof ViewTypes)[keyof typeof ViewTypes];
