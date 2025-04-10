"""
Portfolio Simulation Engine Calculations

This module contains all the mathematical calculations used in the portfolio simulation engine.
Each function is documented with its purpose, inputs, outputs, and the mathematical formula used.
"""

import numpy as np
from scipy import optimize
from typing import Dict, List, Tuple, Union, Optional, Any
import pandas as pd

# Default parameters
DEFAULT_PARAMS = {
    'initialInvestment': 50000000,  # Initial fund size ($)
    'interestRate': 5.0,            # Annual interest rate (%)
    'propertyAppreciation': 3.0,    # Annual property appreciation rate (%)
    'defaultRate': 1.0,             # Annual default rate (%)
    'reinvestmentRate': 70.0,       # Percentage of returns reinvested (%)
    'targetLtv': 60.0,              # Target loan-to-value ratio (%)
    'avgTermLength': 2.0,           # Average loan term length (years)
    'initialDeploymentPeriod': 3.0, # Initial capital deployment period (years)
    'lastReinvestmentYear': 7.0,    # Last year when capital can be reinvested
    'managementFee': 2.0,           # Annual management fee (%)
    'performanceFee': 20.0,         # Performance fee on profits above hurdle (%)
    'hurdleRate': 8.0,              # Hurdle rate for performance fee (%)
    'upfrontFee': 3.0,              # Upfront fee on loan origination (%)
    'timeHorizon': 10,              # Fund lifetime (years)
    'volatility': 2.0,              # Volatility in simulation outcomes (%)
    'numSimulations': 1000,         # Number of Monte Carlo simulations
    'earlyRepaymentRate': 15.0,     # Annual early repayment rate (%)
    'waterfallType': 'european',    # Waterfall structure (european, american, hybrid)
    'zoneAllocation': {'green': 60, 'orange': 30, 'red': 10},  # Zone allocation (%)
    'geographyAllocation': {'sydney': 70, 'melbourne': 20, 'brisbane': 10}  # Geography allocation (%)
}

def validate_parameters(params: Dict[str, Any]) -> None:
    """
    Validate the input parameters to ensure they are within reasonable bounds.

    Args:
        params: Dictionary of parameters

    Raises:
        ValueError: If any parameter is invalid
    """
    if params.get('initialInvestment', 0) <= 0:
        raise ValueError("Initial investment must be positive")
    if params.get('timeHorizon', 0) <= 0:
        raise ValueError("Time horizon must be positive")
    if params.get('numSimulations', 0) <= 0:
        raise ValueError("Number of simulations must be positive")
    if not (0 <= params.get('reinvestmentRate', 0) <= 100):
        raise ValueError("Reinvestment rate must be between 0 and 100")
    if params.get('lastReinvestmentYear', 0) > params.get('timeHorizon', 0):
        raise ValueError("Last reinvestment year cannot exceed time horizon")
    if not (0 <= params.get('managementFee', 0) <= 10):
        raise ValueError("Management fee must be between 0 and 10%")
    if not (0 <= params.get('performanceFee', 0) <= 50):
        raise ValueError("Performance fee must be between 0 and 50%")
    if not (0 <= params.get('hurdleRate', 0) <= 20):
        raise ValueError("Hurdle rate must be between 0 and 20%")
    if not (0 <= params.get('upfrontFee', 0) <= 10):
        raise ValueError("Upfront fee must be between 0 and 10%")
    if not (0 <= params.get('targetLtv', 0) <= 100):
        raise ValueError("Target LTV must be between 0 and 100%")
    if not (0 <= params.get('defaultRate', 0) <= 100):
        raise ValueError("Default rate must be between 0 and 100%")
    if not (0 <= params.get('earlyRepaymentRate', 0) <= 100):
        raise ValueError("Early repayment rate must be between 0 and 100%")

    # Validate allocations
    zone_total = sum(params.get('zoneAllocation', {}).values())
    if abs(zone_total - 100) > 0.01:
        raise ValueError("Zone allocation percentages must sum to 100%")
    geo_total = sum(params.get('geographyAllocation', {}).values())
    if abs(geo_total - 100) > 0.01:
        raise ValueError("Geography allocation percentages must sum to 100%")

def calculate_irr(cash_flows: List[float]) -> float:
    """
    Calculate the Internal Rate of Return (IRR) for a series of cash flows.

    IRR is the discount rate that makes the net present value (NPV) of all cash flows equal to zero.

    Formula: NPV = Σ(Ct / (1 + IRR)^t) = 0
    where Ct is the cash flow at time t

    Args:
        cash_flows: List of cash flows, starting with the initial investment (negative value)

    Returns:
        IRR as a decimal (e.g., 0.10 for 10%)
    """
    if not cash_flows or len(cash_flows) < 2:
        return 0.0

    # Check for invalid cash flow patterns
    if all(cf >= 0 for cf in cash_flows) or all(cf <= 0 for cf in cash_flows):
        return 0.0

    try:
        # Use numpy's IRR function for better reliability
        irr = np.irr(cash_flows)
        if np.isnan(irr) or irr < -1.0 or irr > 100.0:
            return 0.0
        return irr
    except:
        # Fallback to iterative method
        def npv(rate: float) -> float:
            return sum(cf / (1 + rate) ** t for t, cf in enumerate(cash_flows))
        try:
            irr = optimize.newton(npv, x0=0.1, tol=1e-6, maxiter=1000)
            if -1.0 < irr < 100.0:
                return irr
            return 0.0
        except:
            return 0.0

def calculate_equity_multiple(cash_flows: List[float]) -> float:
    """
    Calculate the equity multiple for a series of cash flows.

    Equity Multiple = Total Cash Distributions / Total Cash Invested

    Args:
        cash_flows: List of cash flows, starting with the initial investment (negative value)

    Returns:
        Equity multiple as a decimal (e.g., 1.5 means 1.5x the initial investment)
    """
    if not cash_flows or len(cash_flows) < 2:
        return 1.0

    investments = sum(abs(cf) for cf in cash_flows if cf < 0)
    distributions = sum(cf for cf in cash_flows if cf > 0)

    if investments == 0:
        return 1.0

    return distributions / investments

def calculate_sharpe_ratio(returns: List[float], risk_free_rate: float = 0.02) -> float:
    """
    Calculate the Sharpe Ratio for a series of returns.

    Formula: Sharpe Ratio = (Mean Return - Risk-Free Rate) / Std Dev of Returns

    Args:
        returns: List of annual returns
        risk_free_rate: Annual risk-free rate (default 2%)

    Returns:
        Sharpe Ratio
    """
    if not returns or len(returns) < 2:
        return 0.0

    mean_return = np.mean(returns)
    std_return = np.std(returns, ddof=1)

    if std_return == 0:
        return 0.0

    return (mean_return - risk_free_rate) / std_return

def calculate_max_drawdown(cash_flows: List[float]) -> float:
    """
    Calculate the maximum drawdown for a series of cash flows.

    Max Drawdown = (Peak - Trough) / Peak

    Args:
        cash_flows: List of cash flows

    Returns:
        Max drawdown as a decimal (e.g., 0.2 for 20%)
    """
    if not cash_flows or len(cash_flows) < 2:
        return 0.0

    # Calculate cumulative value
    cumulative = np.cumsum(cash_flows)
    peak = np.maximum.accumulate(cumulative)
    drawdowns = (peak - cumulative) / peak

    return float(np.max(drawdowns)) if len(drawdowns) > 0 else 0.0

def calculate_var(returns: List[float], confidence_level: float = 0.95) -> float:
    """
    Calculate Value at Risk (VaR) for a series of returns.

    VaR represents the potential loss in value at a given confidence level.

    Args:
        returns: List of returns
        confidence_level: Confidence level (e.g., 0.95 for 95%)

    Returns:
        VaR value (negative number indicating potential loss)
    """
    if not returns or len(returns) < 2:
        return 0.0

    # Sort returns and find the percentile
    var = np.percentile(returns, 100 * (1 - confidence_level))
    return float(var)

def calculate_correlations(irr_values: List[float], equity_multiples: List[float], final_values: List[float]) -> Dict[str, float]:
    """
    Calculate correlations between IRR, equity multiple, and final value (as a proxy for risk).

    Args:
        irr_values: List of IRR values from simulations
        equity_multiples: List of equity multiples from simulations
        final_values: List of final portfolio values from simulations

    Returns:
        Dictionary of correlation coefficients
    """
    if len(irr_values) < 2:
        return {
            'irr_equity_multiple': 0.0,
            'irr_risk': 0.0,
            'equity_multiple_risk': 0.0
        }

    # Use final values as a proxy for risk (lower final value = higher risk)
    risk_proxy = [-fv for fv in final_values]

    return {
        'irr_equity_multiple': float(np.corrcoef(irr_values, equity_multiples)[0, 1]),
        'irr_risk': float(np.corrcoef(irr_values, risk_proxy)[0, 1]),
        'equity_multiple_risk': float(np.corrcoef(equity_multiples, risk_proxy)[0, 1])
    }

def calculate_waterfall_distribution(cash_flows: List[float], params: Dict[str, Any]) -> Tuple[List[float], List[float], Dict[str, float]]:
    """
    Calculate the waterfall distribution between LP and GP based on the waterfall structure.

    Args:
        cash_flows: List of cash flows
        params: Dictionary of parameters including hurdle rate, performance fee, etc.

    Returns:
        Tuple of (lp_cash_flows, gp_cash_flows, revenue_streams)
    """
    hurdle_rate = params.get('hurdleRate', DEFAULT_PARAMS['hurdleRate']) / 100
    performance_fee = params.get('performanceFee', DEFAULT_PARAMS['performanceFee']) / 100
    management_fee = params.get('managementFee', DEFAULT_PARAMS['managementFee']) / 100
    upfront_fee = params.get('upfrontFee', DEFAULT_PARAMS['upfrontFee']) / 100
    initial_investment = params.get('initialInvestment', DEFAULT_PARAMS['initialInvestment'])
    waterfall_type = params.get('waterfallType', DEFAULT_PARAMS['waterfallType'])
    time_horizon = params.get('timeHorizon', DEFAULT_PARAMS['timeHorizon'])

    lp_cash_flows = cash_flows.copy()
    gp_cash_flows = [0.0] * len(cash_flows)
    revenue_streams = {
        'management_fee': 0.0,
        'upfront_fee': 0.0,
        'performance_fee': 0.0,
        'total': 0.0
    }

    # Calculate management fee (annual fee on AUM)
    for year in range(1, len(cash_flows)):
        # Simplified AUM: use initial investment adjusted by cumulative cash flows
        aum = initial_investment + sum(cash_flows[:year])
        mgmt_fee = aum * management_fee
        revenue_streams['management_fee'] += mgmt_fee
        gp_cash_flows[year] += mgmt_fee
        lp_cash_flows[year] -= mgmt_fee

    # Calculate upfront fee (applied during deployment period)
    deployment_period = params.get('initialDeploymentPeriod', DEFAULT_PARAMS['initialDeploymentPeriod'])
    for year in range(1, min(int(deployment_period) + 1, len(cash_flows))):
        deployed_amount = initial_investment / deployment_period
        upfront_fee_revenue = deployed_amount * upfront_fee
        revenue_streams['upfront_fee'] += upfront_fee_revenue
        gp_cash_flows[year] += upfront_fee_revenue
        lp_cash_flows[year] -= upfront_fee_revenue

    # Calculate performance fee based on waterfall structure
    if waterfall_type == 'european':
        # European waterfall: calculate on total returns at the end
        total_distributions = sum(cf for cf in cash_flows[1:] if cf > 0)
        total_invested = abs(cash_flows[0])

        # Calculate cumulative hurdle return
        cumulative_hurdle = total_invested
        for year in range(time_horizon):
            cumulative_hurdle *= (1 + hurdle_rate)

        # Calculate excess return above hurdle
        excess_return = max(0, total_distributions - cumulative_hurdle)
        perf_fee = excess_return * performance_fee

        if perf_fee > 0 and len(cash_flows) > 1:
            revenue_streams['performance_fee'] += perf_fee
            gp_cash_flows[-1] += perf_fee
            lp_cash_flows[-1] -= perf_fee

    elif waterfall_type == 'american':
        # American waterfall: calculate on a deal-by-deal basis
        cumulative_invested = abs(cash_flows[0])
        cumulative_distributed = 0.0
        for year in range(1, len(cash_flows)):
            if cash_flows[year] > 0:
                cumulative_distributed += cash_flows[year]
                # Calculate hurdle for the invested capital up to this point
                hurdle_amount = cumulative_invested * (1 + hurdle_rate) ** year
                excess_return = max(0, cumulative_distributed - hurdle_amount)
                perf_fee = excess_return * performance_fee
                if perf_fee > 0:
                    revenue_streams['performance_fee'] += perf_fee
                    gp_cash_flows[year] += perf_fee
                    lp_cash_flows[year] -= perf_fee

    else:  # Hybrid waterfall
        # Hybrid: Apply European-style for first half of fund life, then American-style
        mid_point = time_horizon // 2
        cumulative_invested = abs(cash_flows[0])
        cumulative_distributed = 0.0

        # First half: European-style (accumulate returns)
        for year in range(1, mid_point + 1):
            if cash_flows[year] > 0:
                cumulative_distributed += cash_flows[year]

        # Apply European waterfall at midpoint
        hurdle_amount = cumulative_invested * (1 + hurdle_rate) ** mid_point
        excess_return = max(0, cumulative_distributed - hurdle_amount)
        perf_fee = excess_return * performance_fee
        if perf_fee > 0:
            revenue_streams['performance_fee'] += perf_fee
            gp_cash_flows[mid_point] += perf_fee
            lp_cash_flows[mid_point] -= perf_fee

        # Second half: American-style (deal-by-deal)
        for year in range(mid_point + 1, len(cash_flows)):
            if cash_flows[year] > 0:
                cumulative_distributed += cash_flows[year]
                hurdle_amount = cumulative_invested * (1 + hurdle_rate) ** year
                excess_return = max(0, cumulative_distributed - hurdle_amount)
                perf_fee = excess_return * performance_fee
                if perf_fee > 0:
                    revenue_streams['performance_fee'] += perf_fee
                    gp_cash_flows[year] += perf_fee
                    lp_cash_flows[year] -= perf_fee

    revenue_streams['total'] = sum(revenue_streams.values())
    return lp_cash_flows, gp_cash_flows, revenue_streams

def calculate_loan_returns(params: Dict[str, Any], loan_amount: float, term_years: float, zone: str, geography: str) -> Tuple[float, float]:
    """
    Calculate the returns from a single loan, adjusted for zone and geography risk.

    Args:
        params: Dictionary of parameters
        loan_amount: Amount of the loan
        term_years: Term of the loan in years
        zone: Risk zone ('green', 'orange', 'red')
        geography: Geography ('sydney', 'melbourne', 'brisbane')

    Returns:
        Tuple of (total_return, annual_return_rate)
    """
    interest_rate = params.get('interestRate', DEFAULT_PARAMS['interestRate']) / 100
    property_appreciation = params.get('propertyAppreciation', DEFAULT_PARAMS['propertyAppreciation']) / 100
    upfront_fee = params.get('upfrontFee', DEFAULT_PARAMS['upfrontFee']) / 100
    target_ltv = params.get('targetLtv', DEFAULT_PARAMS['targetLtv']) / 100
    default_rate = params.get('defaultRate', DEFAULT_PARAMS['defaultRate']) / 100
    volatility = params.get('volatility', DEFAULT_PARAMS['volatility']) / 100

    # Adjust default rate based on zone
    zone_multipliers = {'green': 0.5, 'orange': 1.0, 'red': 1.5}
    adjusted_default_rate = default_rate * zone_multipliers.get(zone, 1.0)

    # Adjust interest rate based on geography (simplified)
    geo_multipliers = {'sydney': 1.0, 'melbourne': 1.1, 'brisbane': 1.2}
    adjusted_interest_rate = interest_rate * geo_multipliers.get(geography, 1.0)

    # Calculate property value based on LTV
    property_value = loan_amount / target_ltv

    # Calculate upfront fee revenue
    upfront_fee_revenue = loan_amount * upfront_fee

    # Calculate interest revenue (simple interest)
    interest_revenue = loan_amount * adjusted_interest_rate * term_years

    # Calculate property appreciation
    appreciated_value = property_value * (1 + property_appreciation) ** term_years
    appreciation_revenue = (appreciated_value - property_value) * target_ltv

    # Calculate total return before default risk
    total_return = upfront_fee_revenue + interest_revenue + appreciation_revenue

    # Adjust for default risk (expected loss)
    expected_loss = loan_amount * adjusted_default_rate * term_years
    total_return -= expected_loss

    # Apply volatility
    total_return *= (1 + np.random.normal(0, volatility))

    # Calculate annual return rate
    annual_return_rate = (total_return / loan_amount) / term_years if term_years > 0 else 0.0

    return total_return, annual_return_rate

def calculate_loan_portfolio(params: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Generate a portfolio of loans based on the parameters, incorporating zone and geography allocations.

    Args:
        params: Dictionary of parameters

    Returns:
        List of loan dictionaries with amount, term, expected return, zone, and geography
    """
    initial_investment = params.get('initialInvestment', DEFAULT_PARAMS['initialInvestment'])
    avg_term_length = params.get('avgTermLength', DEFAULT_PARAMS['avgTermLength'])
    volatility = params.get('volatility', DEFAULT_PARAMS['volatility']) / 100
    zone_allocation = params.get('zoneAllocation', DEFAULT_PARAMS['zoneAllocation'])
    geography_allocation = params.get('geographyAllocation', DEFAULT_PARAMS['geographyAllocation'])

    # Number of loans (1 loan per million, minimum 10)
    num_loans = max(10, int(initial_investment / 1000000))
    avg_loan_size = initial_investment / num_loans

    # Generate zone and geography distributions
    zones = list(zone_allocation.keys())
    zone_probs = [zone_allocation[zone] / 100 for zone in zones]
    geographies = list(geography_allocation.keys())
    geo_probs = [geography_allocation[geo] / 100 for geo in geographies]

    loans = []
    for _ in range(num_loans):
        # Randomize loan amount
        loan_amount = avg_loan_size * (1 + np.random.normal(0, volatility))
        loan_amount = max(100000, loan_amount)  # Minimum loan size

        # Randomize term length
        term_years = avg_term_length * (1 + np.random.normal(0, volatility / 2))
        term_years = max(0.5, min(10, term_years))

        # Assign zone and geography
        zone = np.random.choice(zones, p=zone_probs)
        geography = np.random.choice(geographies, p=geo_probs)

        # Calculate expected return
        total_return, annual_return = calculate_loan_returns(params, loan_amount, term_years, zone, geography)

        loans.append({
            'amount': loan_amount,
            'term_years': term_years,
            'total_return': total_return,
            'annual_return': annual_return,
            'zone': zone,
            'geography': geography,
            'start_year': 0,  # Will be set during deployment
            'active': True,
            'defaulted': False,
            'early_repaid': False
        })

    return loans

def calculate_portfolio_cash_flows(params: Dict[str, Any], loans: Optional[List[Dict[str, Any]]] = None) -> Tuple[List[float], List[float], List[float], List[Dict[str, float]], float]:
    """
    Calculate the cash flows for the entire portfolio over time.

    Args:
        params: Dictionary of parameters
        loans: Optional list of loans (if not provided, will be generated)

    Returns:
        Tuple of (cash_flows, portfolio_values, lp_cash_flows, capital_metrics, early_repayment_rate)
    """
    initial_investment = params.get('initialInvestment', DEFAULT_PARAMS['initialInvestment'])
    time_horizon = params.get('timeHorizon', DEFAULT_PARAMS['timeHorizon'])
    reinvestment_rate = params.get('reinvestmentRate', DEFAULT_PARAMS['reinvestmentRate']) / 100
    last_reinvestment_year = params.get('lastReinvestmentYear', DEFAULT_PARAMS['lastReinvestmentYear'])
    early_repayment_rate = params.get('earlyRepaymentRate', DEFAULT_PARAMS['earlyRepaymentRate']) / 100
    default_rate = params.get('defaultRate', DEFAULT_PARAMS['defaultRate']) / 100
    deployment_period = params.get('initialDeploymentPeriod', DEFAULT_PARAMS['initialDeploymentPeriod'])

    # Generate loans if not provided
    if loans is None:
        loans = calculate_loan_portfolio(params)

    # Initialize cash flows and portfolio values
    cash_flows = [0.0] * (time_horizon + 1)
    portfolio_values = [0.0] * (time_horizon + 1)
    capital_metrics = []
    cash_flows[0] = -initial_investment
    portfolio_values[0] = initial_investment

    # Track capital
    available_capital = initial_investment
    invested_capital = 0.0
    total_early_repayments = 0
    total_loans = len(loans)

    # Deploy capital over the deployment period
    remaining_loans = loans.copy()
    for year in range(1, min(int(deployment_period) + 1, time_horizon + 1)):
        deploy_amount = initial_investment / deployment_period
        if deploy_amount > available_capital:
            deploy_amount = available_capital

        # Deploy loans until deploy_amount is used up
        deployed_amount = 0.0
        i = 0
        while i < len(remaining_loans) and deployed_amount < deploy_amount:
            loan = remaining_loans[i]
            if deployed_amount + loan['amount'] <= deploy_amount:
                loan['start_year'] = year
                deployed_amount += loan['amount']
                remaining_loans.pop(i)
            else:
                i += 1

        invested_capital += deployed_amount
        available_capital -= deployed_amount

    # Process each year
    for year in range(1, time_horizon + 1):
        returns_this_year = 0.0

        # Process each loan
        for loan in loans:
            if not loan['active']:
                continue

            start_year = loan['start_year']
            if start_year == 0 or year < start_year:
                continue

            years_active = year - start_year
            term_years = loan['term_years']

            # Check for default
            if not loan['defaulted'] and np.random.random() < default_rate:
                loan['defaulted'] = True
                loan['active'] = False
                recovery_rate = 0.6  # 60% recovery
                returns_this_year += loan['amount'] * recovery_rate
                continue

            # Check for early repayment
            if not loan['early_repaid'] and years_active < term_years and np.random.random() < early_repayment_rate:
                loan['early_repaid'] = True
                loan['active'] = False
                total_early_repayments += 1
                prorated_return = loan['total_return'] * (years_active / term_years)
                returns_this_year += loan['amount'] + prorated_return
                continue

            # Check for maturity
            if years_active >= term_years:
                loan['active'] = False
                returns_this_year += loan['amount'] + loan['total_return']
                continue

        # Add returns to cash flow
        cash_flows[year] += returns_this_year

        # Reinvestment logic
        if year <= last_reinvestment_year:
            reinvestment_amount = returns_this_year * reinvestment_rate
            available_capital += reinvestment_amount
            cash_flows[year] -= reinvestment_amount

            # Calculate average loan size
            avg_loan_size = initial_investment / max(10, int(initial_investment / 1000000))  # Same calculation as in calculate_loan_portfolio

            # Create new loans with reinvested capital
            while available_capital >= avg_loan_size and year <= last_reinvestment_year:
                new_loan = calculate_loan_portfolio(params)[0]  # Generate one loan
                new_loan['start_year'] = year
                new_loan['amount'] = min(available_capital, new_loan['amount'])
                loans.append(new_loan)
                available_capital -= new_loan['amount']
                invested_capital += new_loan['amount']
                total_loans += 1

        # Update portfolio value
        portfolio_values[year] = invested_capital + available_capital

        # Update capital metrics
        capital_metrics.append({
            'invested': invested_capital,
            'available': available_capital,
            'total': invested_capital + available_capital
        })

    # Calculate LP and GP cash flows
    lp_cash_flows, gp_cash_flows, revenue_streams = calculate_waterfall_distribution(cash_flows, params)

    # Calculate actual early repayment rate
    actual_early_repayment_rate = (total_early_repayments / total_loans) if total_loans > 0 else 0.0

    return cash_flows, portfolio_values, lp_cash_flows, capital_metrics, actual_early_repayment_rate

def run_monte_carlo_simulation(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Run a Monte Carlo simulation for the portfolio.

    Args:
        params: Dictionary of parameters

    Returns:
        Dictionary of simulation results
    """
    # Validate parameters
    validate_parameters(params)

    num_simulations = params.get('numSimulations', DEFAULT_PARAMS['numSimulations'])
    time_horizon = params.get('timeHorizon', DEFAULT_PARAMS['timeHorizon'])
    volatility = params.get('volatility', DEFAULT_PARAMS['volatility']) / 100

    # Initialize arrays to store results
    all_cash_flows = []
    all_portfolio_values = []
    all_lp_cash_flows = []
    all_gp_cash_flows = []
    all_capital_metrics = []
    irr_values = []
    gp_irr_values = []
    equity_multiple_values = []
    final_values = []
    returns_series = []
    early_repayment_rates = []

    # Generate base loan portfolio
    base_loans = calculate_loan_portfolio(params)

    # Run simulations
    for _ in range(num_simulations):
        # Apply stochastic variation to key parameters
        sim_params = params.copy()
        sim_params['interestRate'] = params['interestRate'] * (1 + np.random.normal(0, volatility))
        sim_params['propertyAppreciation'] = params['propertyAppreciation'] * (1 + np.random.normal(0, volatility))
        sim_params['defaultRate'] = params['defaultRate'] * (1 + np.random.normal(0, volatility))
        sim_params['earlyRepaymentRate'] = params['earlyRepaymentRate'] * (1 + np.random.normal(0, volatility))

        # Run simulation
        cash_flows, portfolio_values, lp_cash_flows, capital_metrics, early_repayment_rate = calculate_portfolio_cash_flows(sim_params, base_loans.copy())
        all_cash_flows.append(cash_flows)
        all_portfolio_values.append(portfolio_values)
        all_lp_cash_flows.append(lp_cash_flows)
        _, gp_cash_flows, _ = calculate_waterfall_distribution(cash_flows, sim_params)
        all_gp_cash_flows.append(gp_cash_flows)
        all_capital_metrics.append(capital_metrics)
        early_repayment_rates.append(early_repayment_rate)

        # Calculate metrics
        irr = calculate_irr(cash_flows)
        irr_values.append(irr)

        gp_irr = calculate_irr(gp_cash_flows)
        gp_irr_values.append(gp_irr)

        equity_multiple = calculate_equity_multiple(cash_flows)
        equity_multiple_values.append(equity_multiple)

        final_value = sum(cf for cf in cash_flows[1:] if cf > 0)
        final_values.append(final_value)

        # Calculate annual returns for Sharpe ratio
        annual_returns = []
        for t in range(1, len(cash_flows)):
            if portfolio_values[t-1] != 0:
                annual_return = (cash_flows[t] / portfolio_values[t-1])
                annual_returns.append(annual_return)
        returns_series.append(annual_returns)

    # Helper function to safely convert numpy values to float
    def safe_float(value):
        if np.isnan(value) or np.isinf(value):
            return 0.0
        return float(value)

    # Calculate statistics
    statistics = {
        'final_value': {
            'mean': safe_float(np.mean(final_values)),
            'median': safe_float(np.median(final_values)),
            'min': safe_float(np.min(final_values)) if final_values else 0.0,
            'max': safe_float(np.max(final_values)) if final_values else 0.0
        },
        'irr': {
            'mean': safe_float(np.mean(irr_values)),
            'median': safe_float(np.median(irr_values)),
            'min': safe_float(np.min(irr_values)) if irr_values else 0.0,
            'max': safe_float(np.max(irr_values)) if irr_values else 0.0
        },
        'gp_irr': {
            'mean': safe_float(np.mean(gp_irr_values)),
            'median': safe_float(np.median(gp_irr_values)),
            'min': safe_float(np.min(gp_irr_values)) if gp_irr_values else 0.0,
            'max': safe_float(np.max(gp_irr_values)) if gp_irr_values else 0.0
        },
        'equity_multiple': {
            'mean': safe_float(np.mean(equity_multiple_values)),
            'median': safe_float(np.median(equity_multiple_values)),
            'min': safe_float(np.min(equity_multiple_values)) if equity_multiple_values else 0.0,
            'max': safe_float(np.max(equity_multiple_values)) if equity_multiple_values else 0.0
        },
        'sharpe_ratio': {
            'mean': safe_float(np.mean([safe_float(calculate_sharpe_ratio(returns)) for returns in returns_series]))
        },
        'max_drawdown': {
            'mean': safe_float(np.mean([safe_float(calculate_max_drawdown(cf)) for cf in all_cash_flows]))
        },
        'early_repayment_rate': {
            'mean': safe_float(np.mean(early_repayment_rates))
        },
        'correlation': calculate_correlations(irr_values, equity_multiple_values, final_values),
        'risk': {
            'var_95': safe_float(calculate_var([sum(cf[1:]) for cf in all_cash_flows], 0.95))
        }
    }

    # Calculate mean cash flows and time series data
    mean_cash_flows = [safe_float(x) for x in np.mean(all_cash_flows, axis=0).tolist()]
    mean_portfolio_values = [safe_float(x) for x in np.mean(all_portfolio_values, axis=0).tolist()]
    mean_lp_cash_flows = [safe_float(x) for x in np.mean(all_lp_cash_flows, axis=0).tolist()]
    mean_gp_cash_flows = [safe_float(x) for x in np.mean(all_gp_cash_flows, axis=0).tolist()]

    # Calculate IRR by year
    irr_by_year = []
    for year in range(1, time_horizon + 1):
        year_cash_flows = [cf[:year+1] for cf in all_cash_flows]
        year_irrs = [calculate_irr(cf) for cf in year_cash_flows]
        irr_by_year.append(safe_float(np.mean(year_irrs)))

    # Calculate mean capital metrics
    mean_capital_metrics = []
    for year in range(time_horizon + 1):
        year_metrics = [cm[year] for cm in all_capital_metrics if year < len(cm)]
        if year_metrics:
            mean_metrics = {
                'invested': safe_float(np.mean([m['invested'] for m in year_metrics])),
                'available': safe_float(np.mean([m['available'] for m in year_metrics])),
                'total': safe_float(np.mean([m['total'] for m in year_metrics]))
            }
        else:
            mean_metrics = {
                'invested': 0.0,
                'available': 0.0,
                'total': 0.0
            }
        mean_capital_metrics.append(mean_metrics)

    # Calculate revenue streams (based on mean cash flows)
    _, _, revenue_streams = calculate_waterfall_distribution(mean_cash_flows, params)
    statistics['revenue_streams'] = revenue_streams

    # Prepare time series data
    time_series = {
        'irr_by_year': irr_by_year,
        'lp_cash_flows': mean_lp_cash_flows,
        'portfolio_value': mean_portfolio_values,
        'cash_flows': {
            'lp': mean_lp_cash_flows,
            'gp': mean_gp_cash_flows
        },
        'capital_metrics': mean_capital_metrics
    }

    return {
        'statistics': statistics,
        'time_series': time_series,
        'irr': irr_values  # Raw IRR values for histogram
    }

if __name__ == "__main__":
    # Example usage
    results = run_monte_carlo_simulation(DEFAULT_PARAMS)
    print("Simulation Results:")
    print(f"Mean IRR: {results['statistics']['irr']['mean']*100:.2f}%")
    print(f"Mean Equity Multiple: {results['statistics']['equity_multiple']['mean']:.2f}x")
    print(f"Mean Final Value: ${results['statistics']['final_value']['mean']:,.2f}")
    print(f"Sharpe Ratio: {results['statistics']['sharpe_ratio']['mean']:.2f}")
    print(f"Max Drawdown: {results['statistics']['max_drawdown']['mean']*100:.2f}%")
    print(f"Revenue Streams: {results['statistics']['revenue_streams']}")