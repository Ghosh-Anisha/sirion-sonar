import { people } from "../data/people";
import { ledgerRows } from "../logic/ledger";
import { useLedger } from "../state/useLedger";
import { LedgerMiniRow } from "./LedgerMiniRow";
import { Part } from "./Part";

const SHOWN = ["cloudmetric-subscription", "brightline-logistics", "orbis-facilities", "kestrel-freight", "pinecrest-msa"];

/** Column 4: the record, a few rows of the live ledger with their labels. */
export function LedgerColumn() {
  const { contracts, vendors, paid, today } = useLedger();
  const rows = ledgerRows(contracts, vendors, people, paid, today).filter((r) => SHOWN.includes(r.contractId));
  return (
    <Part id="ledger" thinking="contract.dates" label="The record, the ledger of contracts with their dates and labels" className="ledger-mini">
      <span className="ledger-mini__head">
        <span>Vendor</span>
        <span>Notice by</span>
      </span>
      {rows.map((r) => (
        <LedgerMiniRow key={r.contractId} id={r.contractId} supplier={r.supplier.split(" ")[0]} deadline={r.noticeDeadline} label={r.label} />
      ))}
    </Part>
  );
}
