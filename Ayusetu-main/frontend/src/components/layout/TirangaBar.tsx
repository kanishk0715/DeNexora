/** Indian national flag bands for government-style headers. */
export function TirangaBar() {
  return (
    <div
      className="flex h-2 w-full shrink-0 overflow-hidden border-b border-black/10"
      role="img"
      aria-label="Indian national flag colours"
    >
      <span className="h-full flex-1 bg-[#FF9933]" />
      <span className="relative h-full flex-1 bg-white">
        <span
          className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[#000080]"
          aria-hidden
        />
      </span>
      <span className="h-full flex-1 bg-[#138808]" />
    </div>
  );
}
