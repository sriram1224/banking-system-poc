# Use an official OpenJDK runtime as a parent image
FROM maven:3.8.5-openjdk-17

# Set the working directory in the container
WORKDIR /app

# Copy the Maven project file
COPY pom.xml .

# Download and cache dependencies
RUN mvn dependency:go-offline

# Copy the rest of the application's source code
COPY src ./src

# Build the application
RUN mvn package -DskipTests

# Expose the port the app runs on
EXPOSE 8080


# Run the application
ENTRYPOINT ["java", "-jar", "target/SYSTEM 2.jar"]
