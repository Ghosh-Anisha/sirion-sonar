import { orderItems } from "../logic/order";
import { toRow } from "../state/useNeedsYou";
import { useLedger } from "../state/useLedger";
import { ClockControl } from "../components/layout/ClockControl";
import { CockpitRow } from "./CockpitRow";
import { Part } from "./Part";

const SHOWN = 4;
const EXAMPLE = "check:brightline-invoice";

/** Column 5: a live miniature of the Needs you list, from the same data and parts as Home. Move the clock and it changes. */
export function CockpitColumn() {
  const { items, today } = useLedger();
  const open = orderItems(items).filter((i) => i.status === "open");
  const top = open.slice(0, SHOWN);
  const example = open.find((i) => i.id === EXAMPLE);
  if (example && !top.includes(example)) top[SHOWN - 1] = example;
  return (
    <div className="cockpit">
      <Part id="cockpit" thinking="item.routing" label="The cockpit, the live Needs you list" className="cockpit__head">
        <strong>Needs you</strong>
        <span className="num">{open.length} open</span>
      </Part>
      <ul className="cockpit__list">
        {top.map((item) => (
          <CockpitRow key={item.id} row={toRow(item, today)} />
        ))}
      </ul>
      <div className="cockpit__clock">
        <ClockControl />
      </div>
    </div>
  );
}
