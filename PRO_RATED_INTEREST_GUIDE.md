# Pro-Rated Interest Calculation System

## Overview

The CapitalMasters platform now implements **pro-rated interest calculations** for deposits made during an investment cycle. This ensures fair returns based on the actual time each deposit is invested within a cycle.

## Investment Cycles

### Cycle Schedule
- **Cycle 1**: February through May (4 months)
- **Cycle 2**: September through December (4 months)

### Interest Rate
- **Monthly Rate**: 8% per month to investor
- **Full Cycle (4 months)**: 32% total return
- **Pro-rated**: 8% × number of remaining months

## How Pro-Rating Works

### Basic Principle
Each deposit earns interest only for the **remaining months** in the current cycle from the deposit date to the cycle end.

### Calculation Formula
```
Interest = Principal × 8% × Remaining_Months
```

Where `Remaining_Months` = number of months from deposit date through end of cycle (inclusive)

## Examples

### Example 1: Full Cycle Deposit
**Scenario**: Sarah deposits 1,000,000 UGX in January (before Feb-May cycle starts)
- Cycle: February - May (4 months)
- Remaining months: 4 (full cycle)
- Interest: 1,000,000 × 8% × 4 = **320,000 UGX**
- Total value: 1,320,000 UGX

### Example 2: Mid-Cycle Deposit
**Scenario**: Sarah deposits 3,000,000 UGX in March (during Feb-May cycle)
- Cycle: February - May
- Remaining months: 3 (March, April, May)
- Interest: 3,000,000 × 8% × 3 = **720,000 UGX**
- Total value: 3,720,000 UGX

### Example 3: Multiple Deposits
**Scenario**: Sarah makes multiple deposits
- January deposit: 1,000,000 UGX → 4 months → 320,000 UGX interest
- March deposit: 3,000,000 UGX → 3 months → 720,000 UGX interest
- **Total interest**: 1,040,000 UGX
- **Total principal**: 4,000,000 UGX
- **Total payout**: 1,040,000 UGX

## Implementation Details

### Utility Functions
Located in: `lib/interestCalculator.ts`

Key functions:
- `getCurrentCycle()` - Gets the current investment cycle
- `getDepositCycle(date)` - Determines which cycle a deposit belongs to
- `calculateRemainingMonths(date, cycle)` - Calculates months remaining in cycle
- `calculateDepositInterest(date, amount)` - Calculates interest for a single deposit
- `calculateTotalInterest(deposits, cycle)` - Calculates total for multiple deposits

### Month Calculation Logic

```typescript
// If deposit is before cycle starts → Full 4 months
// If deposit is Jan (before Feb-May) → 4 months
// If deposit is Feb (during Feb-May) → 4 months (Feb, Mar, Apr, May)
// If deposit is Mar (during Feb-May) → 3 months (Mar, Apr, May)
// If deposit is Apr (during Feb-May) → 2 months (Apr, May)
// If deposit is May (during Feb-May) → 1 month (May)
```

### UI Updates

#### Client Portal
- Expected payout now shows pro-rated calculation
- Breakdown section shows each deposit's calculation when pro-rated
- Example: "UGX 3,000,000 × 3 months = UGX 720,000"

#### Admin Panel
- Investor payout calculations use pro-rated amounts
- "Generate Payout" button uses calculated pro-rated amount
- Chart displays pro-rated expected returns
- Shows breakdown when deposits have different rates

## Testing Pro-Rated Calculations

### Test Scenario 1: Same Month Deposits
```
User: Sarah
Deposits:
- Feb 1, 2026: 1,000,000 UGX
- Feb 15, 2026: 2,000,000 UGX

Expected:
- Both get 4 months (Feb-May)
- Interest: (1M + 2M) × 8% × 4 = 960,000 UGX
```

### Test Scenario 2: Different Month Deposits  
```
User: Sarah
Deposits:
- Jan 15, 2026: 1,000,000 UGX (before cycle)
- Mar 10, 2026: 3,000,000 UGX (during cycle)

Expected:
- Jan deposit: 1M × 8% × 4 = 320,000 UGX
- Mar deposit: 3M × 8% × 3 = 720,000 UGX
- Total interest: 1,040,000 UGX
```

### Test Scenario 3: Late Cycle Deposit
```
User: Andrew
Deposits:
- May 5, 2026: 5,000,000 UGX

Expected:
- Only 1 month remaining (May)
- Interest: 5M × 8% × 1 = 400,000 UGX
```

## Withdrawals

Withdrawals reduce the principal but **do not affect** the pro-rated calculation for existing deposits. Each deposit's interest is calculated based on:
1. Its deposit date
2. The cycle it falls into
3. Remaining months from deposit to cycle end

## Admin Fee Calculation

The 2% admin fee is applied to the **gross return** (10% monthly), while investors receive 8% monthly.

For pro-rated deposits:
- Gross return = 10% × months
- Investor return = 8% × months  
- Admin fee = 2% × months

Example:
- 3-month deposit of 1,000,000 UGX
- Gross: 1,000,000 × 10% × 3 = 300,000 UGX
- Investor: 1,000,000 × 8% × 3 = 240,000 UGX
- Admin fee: 1,000,000 × 2% × 3 = 60,000 UGX

## FAQ

### Q: What happens if I deposit in June?
A: June deposits are assigned to the next cycle (Sep-Dec), earning 4 months of interest when that cycle completes.

### Q: Do withdrawals affect my interest rate?
A: No. Each deposit's interest is calculated independently based on its deposit date. Withdrawals only reduce your principal.

### Q: What if I deposit on the last day of May?
A: You'll earn 1 month of interest (May only) at 8%.

### Q: How is this different from the old system?
A: **Old system**: All deposits earned flat 32% regardless of timing  
**New system**: Deposits earn 8% per month for remaining cycle months only

### Q: Can I see the breakdown of my pro-rated calculation?
A: Yes! Both the client portal and admin panel show a detailed breakdown when your deposits have pro-rated calculations.

## Migration Notes

- Existing calculations automatically updated
- No data migration required - uses existing transaction dates
- Historical transactions are calculated pro-rata based on their recorded dates
- All future deposits automatically use pro-rated calculation

## Code Locations

- **Utility Library**: `lib/interestCalculator.ts`
- **Client Portal**: `app/client-portal/page.tsx` (lines ~420-480)
- **Admin Panel**: `app/admin/page.tsx` (lines ~1150-1240, ~1305-1330)
- **Users Tab**: `components/admin/UsersTab.tsx` (lines ~70-85)
- **Table Row**: `components/admin/UserTableRow.tsx` (lines ~40-50)

## Support

For questions or issues with pro-rated calculations:
1. Check the breakdown display in client portal
2. Verify deposit dates in transaction history
3. Confirm cycle dates (Feb-May or Sep-Dec)
4. Contact admin for manual verification if needed

---

**Last Updated**: March 4, 2026  
**System Version**: Pro-rated v1.0
