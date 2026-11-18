let subscriptionPlans = [
  { id: 1, category: "Silver", price: "₹ 2999", validity: "1 Months", users: "2 Users" },
  { id: 2, category: "Gold", price: "₹ 3999", validity: "1 Months", users: "4 Users" },
  { id: 3, category: "Platinum", price: "₹ 4999", validity: "1 Months", users: "6 Users" },
];

let listeners = [];

export const getSubscriptionPlans = () => {
  return subscriptionPlans;
};

export const getSubscriptionPlanById = (id) => {
  return subscriptionPlans.find((p) => p.id === parseInt(id));
};

export const addSubscriptionPlan = (plan) => {
  const newPlan = {
    id: subscriptionPlans.length + 1,
    category: plan.name,
    price: `₹ ${plan.price}`,
    validity: `${plan.validity} Days`,
    users: `${plan.users} Users`,
  };
  subscriptionPlans = [...subscriptionPlans, newPlan];
  listeners.forEach((listener) => listener(subscriptionPlans));
};

export const updateSubscriptionPlan = (id, updatedFields) => {
  subscriptionPlans = subscriptionPlans.map((p) => {
    if (p.id === parseInt(id)) {
      return {
        ...p,
        category: updatedFields.name,
        price: `₹ ${updatedFields.price}`,
        validity: `${updatedFields.validity} Days`,
        users: `${updatedFields.users} Users`,
      };
    }
    return p;
  });
  listeners.forEach((listener) => listener(subscriptionPlans));
};

export const deleteSubscriptionPlan = (id) => {
  subscriptionPlans = subscriptionPlans.filter((p) => p.id !== parseInt(id));
  listeners.forEach((listener) => listener(subscriptionPlans));
};

export const subscribeSubscriptions = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};
