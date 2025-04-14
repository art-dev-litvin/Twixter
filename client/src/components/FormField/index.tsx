import classNames from "classnames";
import React from "react";
import Input from "../Input";
import Textarea from "../Textarea";

function FormField({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classNames("", className)} {...props}>
      {children}
    </div>
  );
}

FormField.Label = function ({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={classNames(
        "block text-sm font-medium text-gray-700 mb-1",
        className
      )}
      {...props}>
      {children}
    </label>
  );
};

FormField.Input = function ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <Input className={classNames(className)} {...props} />;
};

FormField.Textarea = function ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <Textarea className={classNames(className)} {...props} />;
};

FormField.Error = function ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classNames("text-red-500 text-sm mt-1", className)}
      {...props}>
      {children}
    </div>
  );
};

export default FormField;
