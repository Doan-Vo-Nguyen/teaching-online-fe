/* eslint-disable react/prop-types */
import ClassAvatar from "./ClassAvatar";

const ClassGrid = ({ classes, classColors, onLeaveClass, onDeleteClass }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <div
          key={classItem.class_id}
          className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden"
        >
          <ClassAvatar
            className={classItem.class_name}
            classId={classItem.class_id}
            color={classColors[classItem.class_id]}
            classInfo={classItem}
            onLeaveClass={onLeaveClass}
            onDeleteClass={onDeleteClass}
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold dark:text-white">
              {classItem.class_name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {classItem.teacher}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassGrid;
