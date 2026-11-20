import { Link } from "react-router-dom";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { costs as copy } from "../data/story";
import { vendors } from "../data/vendors";
import { formatDate, formatMoney, formatPercent } from "../logic/format";
import { costLink, exposureWithin, storyCosts, type StoryCost } from "../logic/storyCosts";
import { SectionHead } from "./SectionHead";
import "./StoryCosts.css";

/** The first days of the demo the exposure total counts. */
const EXPOSURE_DAYS = 30;

const vendorName = (contractId: string) => {
  const contract = contracts.find((c) => c.id === contractId);
  return vendors.find((v) => v.id === contract?.vendorId)?.name ?? contractId;
};

function lines(cost: StoryCost): string[] {
  const due = formatDate(cost.dueDate);
  const amount = formatMoney(cost.amount);
  switch (cost.kind) {
    case "renewal":
      return [copy.cards.renewal.line({ amount, due })];
    case "price-rise": {
      const notice = { received: formatDate(cost.receivedOn), days: cost.noticeDays, noticeBy: formatDate(cost.noticeBy) };
      const c = copy.cards["price-rise"];
      return [
        c.line({ increase: formatPercent(cost.increasePercent), cap: formatPercent(cost.capPercent), monthly: formatMoney(cost.overMonthly), amount }),
        cost.late ? c.late(notice) : c.onTime(notice),
      ];
    }
    case "invoice":
      return [copy.cards.invoice.line({ amount })];
    case "lapse":
      return [copy.cards.lapse.line({ due, amount })];
    case "retainer":
      return [copy.cards.retainer.line({ monthly: formatMoney(cost.monthlyFee), months: cost.months, amount, due })];
  }
}

/** What the problem costs in the sample data, one card each with a bar sized by its amount, and the total due in the first 30 days. */
export function StoryCosts() {
  const list = storyCosts(contracts, emails, DEMO_START);
  const largest = Math.max(...list.map((c) => c.amount));
  const exposure = exposureWithin(list, DEMO_START, EXPOSURE_DAYS);
  const leftOut = exposure.left.map((c) => vendorName(c.contractId)).join(" and ");
  return (
    <section id="costs" className="story-section" aria-labelledby="costs-title">
      <SectionHead id="costs-title" kicker={copy.kicker} headline={copy.headline} lead={copy.lead} />
      <ul className="costs" data-tour="story-costs">
        {list.map((cost) => {
          const card = copy.cards[cost.kind];
          return (
            <li key={cost.kind} className="cost">
              <div className="cost__text">
                <h3 className="cost__title">{card.title}</h3>
                {lines(cost).map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <p className="cost__meta">
                  <span className="label">{copy.dueLabel}</span> <span className="num">{formatDate(cost.dueDate)}</span>
                  <Link to={costLink(cost)} className="cost__link">
                    {card.link}
                  </Link>
                </p>
              </div>
              <div className="cost__bar">
                <span className="cost__amount num">{copy.barLabel(formatMoney(cost.amount))}</span>
                <span className="cost__track" aria-hidden="true">
                  <span className="cost__fill" style={{ width: `${Math.max(1, (cost.amount / largest) * 100)}%` }} />
                </span>
              </div>
            </li>
          );
        })}
        <li className="cost cost--total">
          <div className="cost__text">
            <h3 className="cost__title">{copy.totalLabel}</h3>
            <p>
              {copy.totalNote({ from: formatDate(exposure.from), to: formatDate(exposure.to), count: exposure.included.length })}
              {leftOut && ` ${copy.leftOut(leftOut)}`}
            </p>
          </div>
          <p className="cost__total num">{formatMoney(exposure.total)}</p>
        </li>
      </ul>
      <p className="story-line">{copy.closing}</p>
    </section>
  );
}
