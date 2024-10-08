'use client';

import { useState } from 'react';
import { generate } from './actions';
import { readStreamableValue } from 'ai/rsc';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home() {
  const [generation, setGeneration] = useState(''); // For user input
  const [response, setResponse] = useState(''); // For AI response
  const [inputHistory, setInputHistory] = useState(''); // For displaying user inputs

  return (
    <div>
      <input
        className="responsebox"
        id="text"
        type="text"
        value={generation}
        onChange={event => {
          setGeneration(event.target.value); // Store user input
        }}
      />
      <button
        onClick={async () => {
          const { object } = await generate(generation); // Pass user input for generation

          let responseString = '';

          for await (const partialObject of readStreamableValue(object)) {
            if (partialObject) {
              responseString += JSON.stringify(partialObject.notifications, null, 2);
            }
          }

          // Append user input to input history
          setInputHistory(prevHistory => prevHistory + '\n' + generation);

          // Append new response to the existing response
          setResponse(prevResponse => prevResponse + '\n' + responseString);

          // Clear the input field
          setGeneration('');
        }}
      >
        Ask
      </button>

      <pre>User Input: {inputHistory}</pre> {/* Display user inputs here */}
      <pre>AI Response: {response}</pre> {/* Display AI response here */}
    </div>
  );
}
