export const InspectorComponent = ({ object }: { object: unknown }) => (
  <pre>{JSON.stringify(object, null, 2)}</pre>
);
