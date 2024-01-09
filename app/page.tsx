"use client"
import React, { useState } from "react";
import { callSmartContractFunction } from "./logic/connectContract";

// export default function Page() {
//     return <h1>Hello, Next.js!</h1>
// }

function MyComponent() {
    const [data, setData] = useState("");
  
    async function fetchData() {
      const result = await callSmartContractFunction();
      setData(result.toString());
    }
  
    return (
      <div>
        <button onClick={fetchData}>Daten abrufen</button>
        <p>{data}</p>
      </div>
    );
}

  export default MyComponent;

