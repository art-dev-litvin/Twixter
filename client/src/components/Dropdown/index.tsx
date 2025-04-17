import { createContext, useContext, useState, ReactNode } from "react";

interface DropdownContextProps {
  open: boolean;
  handleOpen: (newOpen: boolean) => () => void;
}
const DropdownContext = createContext<DropdownContextProps | undefined>(
  undefined
);

interface DropdownProps {
  open?: boolean;
  changeOpen?: (open: boolean) => void;
  children: ReactNode;
}

function Dropdown({
  open: controlledOpen,
  changeOpen,
  children,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpen = (newOpen: boolean) => () => {
    const newOpenState = newOpen;
    if (isControlled) {
      changeOpen?.(newOpenState);
    } else {
      setInternalOpen(newOpenState);
      changeOpen?.(newOpenState);
    }
  };

  return (
    <DropdownContext.Provider value={{ open, handleOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
}

function Trigger({ children }: { children: ReactNode }) {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown.Trigger must be used within a Dropdown");
  }

  const { handleOpen } = context;

  return (
    <div onClick={handleOpen(true)} className="cursor-pointer">
      {children}
    </div>
  );
}

function Menu({ children }: { children: ReactNode }) {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown.Menu must be used within a Dropdown");
  }

  const { open, handleOpen } = context;

  return (
    open && (
      <>
        <div
          onClick={handleOpen(false)}
          className="size-full fixed top-0 left-0 z-30"
        />
        <div className="absolute z-40 right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-2 ring-slate-300 focus:outline-none">
          <div className="py-1">{children}</div>
        </div>
      </>
    )
  );
}

function Item({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors">
      {children}
    </div>
  );
}

Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;

export default Dropdown;
