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
  'Reviewer',
]

// One Reviewer role now covers MGS, Finance and Customs, so no role maps to a
// single milestone any more — reviewers are unscoped (see isReviewer).
export const ROLE_MILESTONE = {}

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

// The Reviewer role carries every stage's review rights
export function isReviewer() {
  return roleStore.currentRole === 'Reviewer'
}
