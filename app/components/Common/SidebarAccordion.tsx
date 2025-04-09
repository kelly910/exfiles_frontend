import { Typography } from '@mui/material';
import Image from 'next/image';
import Style from './Sidebar.module.scss';
import AccordionDetails from '@mui/material/AccordionDetails';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';

interface SidebarAccordionProps {
  title: string;
  icon: string;
  expanded: string;
  panelKey: string;
  handleAccordionChange: (
    panel: string
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  children?: React.ReactNode;
}

const SidebarAccordion = ({
  title,
  icon,
  expanded,
  panelKey,
  handleAccordionChange,
  children,
}: SidebarAccordionProps) => {
  return (
    <Accordion
      className={Style['accordian']}
      expanded={expanded === panelKey}
      onChange={handleAccordionChange(panelKey)}
      sx={{
        '.Mui-expanded': {
          backgroundColor: 'var(--Input-Box-Colors)',
        },
        'span.Mui-expanded': {
          transform: 'rotate(0deg)',
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <Image
            className={Style['img-none']}
            src={
              expanded === panelKey
                ? '/images/arrow-down.svg'
                : '/images/arrow-down-right.svg'
            }
            alt="expand-collapse"
            width={16}
            height={16}
          />
        }
        aria-controls={`${panelKey}-content`}
        id={`${panelKey}-header`}
        classes={{
          root: Style['customAccordionHeading'],
          content: Style['customAccordionContent'],
        }}
      >
        <Typography component="span" className={Style['heading']}>
          <Image src={icon} alt="icon" width={18} height={18} />
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails className={`${Style['bottom-content']}`}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default SidebarAccordion;
