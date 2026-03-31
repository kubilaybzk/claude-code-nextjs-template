import Link from 'next/link'
import React from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BreadcrumbItemConfig {
  /** Etiket metni */
  label: string
  /** Link href — verilirse BreadcrumbLink olarak, verilmezse BreadcrumbPage (aktif sayfa) olarak render edilir */
  href?: string
}

interface LayoutIconsProps {
  /** Başlık ikonu bileşeni (namespace'den geçirilir, örn: AcademyIcons.meta.proficiency) */
  icon: React.ElementType
  /** Sayfa başlığı */
  title: string
  /** Kısa açıklama metni */
  desc: string
  /** İkon kutusu arka plan + border className */
  iconWrapperClassName?: string
  /** İkon renk className */
  iconClassName?: string
  /** Breadcrumb öğeleri — verilmezse breadcrumb alanı gösterilmez */
  breadcrumbs?: BreadcrumbItemConfig[]
}

/**
 * Layout başlık alanı — ikon, başlık, açıklama ve opsiyonel breadcrumb gösterir.
 *
 * @example
 * // Sadece başlık
 * <LayouthIcons
 *   icon={AcademyIcons.meta.proficiency}
 *   title="Academy"
 *   desc="LMS Eğitim Platformu"
 *   iconWrapperClassName="bg-cyber-lms/15 border-cyber-lms/30"
 *   iconClassName="text-cyber-lms"
 * />
 *
 * @example
 * // Breadcrumb ile
 * <LayouthIcons
 *   icon={AdminIcons.nav.userManagement}
 *   title="Yeni Kullanıcı"
 *   desc="Admin Paneli"
 *   iconWrapperClassName="bg-primary/15 border-primary/30"
 *   iconClassName="text-primary"
 *   breadcrumbs={[
 *     { label: 'Yeni Kullanıcı' },
 *   ]}
 * />
 */
export default function LayouthIcons({
  icon: Icon,
  title,
  desc,
  iconWrapperClassName = 'bg-cyber-lms/15 border-cyber-lms/30',
  iconClassName = 'text-cyber-lms',
  breadcrumbs,
}: LayoutIconsProps) {
  return (
    <div className="flex flex-col gap-2">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.label}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex items-center gap-3">
        <div
          className={`flex size-9 items-center justify-center rounded-lg border ${iconWrapperClassName}`}
        >
          <Icon className={`size-5 ${iconClassName}`} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-foreground text-xl font-bold">{title}</h1>
          <p className="text-muted-foreground ml-4 font-mono text-xs">{desc}</p>
        </div>
      </div>
    </div>
  )
}
