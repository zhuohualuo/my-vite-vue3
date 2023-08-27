export const tipTitle = `
数据更新时间：实时更新<br/>
总剩余数 = 网点剩余数 + 快递员剩余数<br/>
网点剩余 = 总数 - 分配给快递员 - 转出给子网点数 - 快递员直接使用网点次卡派件数<br/>
快递员剩余 = 分配给快递员数 - 快递员使用分配次卡派件数`

export const DELIVERY_TOTAL = `
派件运单总量：网点绑定的快递员派件总量（运单数）= 网点钱包单票派件运单量+个人付费单票派件运单量+次卡派件运单量+租用格口派件运单量+预约格口派件运单量
(当子项相加不等于总运单量时，为同一包裹使用不同方式派件所致）`

export const WALLET_POST_MONEY = `网点钱包单票派件运单量：网点绑定的快递员，使用网点钱包账户余额派件的件量（运单数）`

export const PERSONAL_PAY_SINGLE = `个人付费单票派件运单量：网点绑定的快递员，使用个人钱包或其他个人支付方式，派件的件量（运单数）`

export const NET_WALLET_SINGL = `网点钱包单票派费：网点绑定的快递员，使用网点钱包账户余额派件，实际支付的金额总和`

export const APP_POST_MOENY = `个人支付单票派费：网点绑定的快递员，使用个人钱包或其他个人支付方式派件，实际支付的金额总和`

export const TOTAL_POST_MONEY = `总派费：网点绑定的快递员派件总量产生的合计派件金额=网点钱包单票派件费+个人付费单票派费+次卡派件金额+格口租用金额+格口预约金额`

export const NET_WALLET_MOENY = `网点钱包单票派费/订单数：网点绑定的快递员，使用网点钱包账户余额派件，实际支付的金额总和，及对应的订单数量`

export const APP_POST_MOENY_ORDER = `个人支付单票派费：网点绑定的快递员，使用个人钱包或其他个人支付方式派件，实际支付的金额总和，及对应的订单数量`

export const CARD_POST_MOENY = `次卡派件金额/消耗数：实际使用的次卡张数，及消耗次卡相应的金额`

export const RENT_MONEY = `格口租用金额/订单数：租用下单时间在选择日期内，租用订单的实际金额，及订单数=网点租用格口订单 + 快递员网点钱包租用订单 + 快递员个人付费租用订单`

export const REVERSE_MOENY = `格口预约金额/订单数格口预约金额/订单数：预约下单时间在选择日期内，预约订单的实际金额，及订单数=快递员网点钱包预约订单+快递员个人付费预约订单`

export const SINGLE_POST_NUM = `网点钱包单票派件运单量：网点绑定的快递员，使用网点钱包账户余额派件的件量（运单数）`

export const APP_POST_NUM = `个人付费单票派件运单量：网点绑定的快递员，使用个人钱包或其他个人支付方式，派件的件量（运单数）`

export const CARD_POST_NUM = `次卡派件运单量：网点绑定的快递员，使用网点次卡派件的运单量`

export const RENT_POST_NUM = `租用格口派件运单量：网点绑定的快递员，使用网点租用格口派件 + 快递员网点钱包租用格口派件 + 快递员个人付费租用格口派件，产生的运单量`

export const REVERSE_POST_NUM = `预约格口派件运单量：网点绑定的快递员，用网点钱包预约格口派件 + 快递员个人付费预约格口派件，产生的运单量`