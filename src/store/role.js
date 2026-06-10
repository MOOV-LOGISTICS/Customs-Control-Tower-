import Vue from 'vue'

// Lightweight global role state (demo). In production this comes from the
// logged-in user's RBAC role; the role switcher exists only to demo
// role-scoped views.
export const roleStore = Vue.observable({
  currentRole: 'MOOV Ops',
})

export const ROLES = [
  'MOOV Ops',
  'Supplier',
  'Pepco PGS',
  'Pepco Finance',
  'Pepco Customs',
  'Customs Broker',
]

// role → milestone the role is allowed to operate on (null = not a reviewer)
export const ROLE_MILESTONE = {
  'Pepco PGS': 'PGS',
  'Pepco Finance': 'FINANCE',
  'Pepco Customs': 'CUSTOMS',
}

export function setRole(role) {
  roleStore.currentRole = role
}

// milestone the current role can operate on; undefined for non-reviewer roles
export function myMilestone() {
  return ROLE_MILESTONE[roleStore.currentRole] || null
}

// MOOV Ops (and demo admin) bypass milestone scoping
export function isOps() {
  return roleStore.currentRole === 'MOOV Ops'
}
