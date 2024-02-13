import ListGroup from "./components/ListGroup";
import Alert from "./components/Alert";

function App() {
  let items = ["1", "2"];

  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  return (
    <div>
      <>
        <ListGroup
          items={items}
          heading={"title"}
          onSelectItem={handleSelectItem}
        />
        <Alert>
          Hello <span>World</span>
        </Alert>
      </>
    </div>
  );
}

export default App;
