import { supabaseAdmin } from './supabase-admin';

interface AuditLogEntry {
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    await supabaseAdmin.from('audit_logs').insert({
      user_id: entry.userId,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId,
      old_values: entry.oldValues,
      new_values: entry.newValues,
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
      metadata: entry.metadata || {},
    });
  } catch {
    // Audit failures should not crash the app
  }
}

export async function logUserAction(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  ipAddress?: string
): Promise<void> {
  return logAudit({ userId, action, resourceType, resourceId, ipAddress });
}
