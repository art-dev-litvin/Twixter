import classNames from "classnames";
import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function Textarea({ ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={classNames(
        "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      )}
    />
  );
}

export default Textarea;
