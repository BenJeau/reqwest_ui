export interface BodyProps {
  body: string;
  setBody: (value: string) => void;
}

const Body: React.FC<BodyProps> = ({ body: value, setBody }) => (
  <textarea
    className="bg-transparent w-full"
    value={value}
    onChange={(e) => setBody(e.target.value)}
  />
);

export default Body;
