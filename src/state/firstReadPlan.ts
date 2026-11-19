import { contracts } from "../data/contracts";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { planFirstRead } from "../logic/firstRead";

/** The first read worked out once from the sample data. The same data always plays the same way. */
export const firstReadPlan = planFirstRead(vendors, contracts, payments, emails);
