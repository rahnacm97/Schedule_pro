const Logo = () => {
  return (
    <div className="w-7 h-7 rounded-md bg-(--text-primary) flex flex-col justify-center items-center gap-0.5 p-1 relative transition-colors shadow-sm">
      <div className="w-full h-1.5 rounded-sm bg-(--bg-main)/20" />
      <div className="w-full flex gap-0.5">
        <div className="flex-1 h-1.25 rounded-xs bg-(--accent-color) opacity-30" />
        <div className="flex-1 h-1.25 rounded-xs bg-(--accent-color) opacity-80" />
        <div className="flex-1 h-1.25 rounded-xs bg-(--accent-color) opacity-30" />
      </div>
      <div className="w-full flex gap-0.5">
        <div className="flex-1 h-1.25 rounded-xs bg-(--accent-color) opacity-80" />
        <div className="flex-1 h-1.25 rounded-xs bg-(--accent-color) opacity-30" />
        <div className="flex-1 h-1.25 rounded-xs bg-(--accent-color) opacity-30" />
      </div>
      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-(--accent-color) shadow-sm" />
    </div>
  );
};

export default Logo;
